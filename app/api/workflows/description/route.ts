import { db } from "@/services/drizzle";
import { videos } from "@/services/drizzle/schema/videos";
import { gemini } from "@/services/gemini";
import { WorkflowNonRetryableError } from "@upstash/workflow";
import { serve } from "@upstash/workflow/nextjs";
import { and, eq } from "drizzle-orm";

type InputType = Readonly<{
  userId: string;
  videoId: string;
}>;

const DESCRIPTION_SYSTEM_PROMPT = `Your task is to summarize the transcript of a video. Please follow these guidelines:
- Be brief. Condense the content into a summary that captures the key points and main ideas without losing important details.
- Avoid jargon or overly complex language unless necessary for the context.
- Focus on the most critical information, ignoring filler, repetitive statements, or irrelevant tangents.
- ONLY return the summary, no other text, annotations, or comments.
- Aim for a summary that is 3-5 sentences long and no more than 200 characters.`;

export const { POST } = serve(async (context) => {
  const input = context.requestPayload as InputType;

  const existingVideo = await context.run("get-video", async () => {
    const [video] = await db
      .select()
      .from(videos)
      .where(
        and(eq(videos.id, input.videoId), eq(videos.userId, input.userId))
      );

    if (!video) {
      throw new WorkflowNonRetryableError("Video not found");
    }
    return video;
  });

  const transcript = await context.run("get-transcript", async () => {
    const trackUrl = `https://stream.mux.com/${existingVideo.muxPlaybackId}/text/${existingVideo.muxTrackId}.txt`;
    const response = await fetch(trackUrl);
    const text = response.text();

    if (!text) {
      throw new Error("Transcript not found");
    } else {
      return text;
    }
  });

  const generatedDescription: string | undefined = await context.run(
    "generate-description",
    async () => {
      const response = await gemini.models.generateContent({
        model: "gemini-flash-latest",
        contents: [
          {
            role: "model",
            parts: [{ text: DESCRIPTION_SYSTEM_PROMPT }],
          },
          {
            role: "user",
            parts: [{ text: transcript }],
          },
        ],
      });
      return response.text;
    }
  );

  await context.run("update-description", async () => {
    await db
      .update(videos)
      .set({ description: generatedDescription || existingVideo.description })
      .where(
        and(eq(videos.id, existingVideo.id), eq(videos.userId, input.userId))
      );
  });
});
