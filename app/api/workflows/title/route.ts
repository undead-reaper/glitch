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

const TITLE_SYSTEM_PROMPT = `Your task is to generate an SEO-focused title for a YouTube video based on its transcript. Please follow these guidelines:
- Be concise but descriptive, using relevant keywords to improve discoverability.
- Highlight the most compelling or unique aspect of the video content.
- Avoid jargon or overly complex language unless it directly supports searchability.
- Use action-oriented phrasing or clear value propositions where applicable.
- Ensure the title is 3-8 words long and no more than 100 characters.
- ONLY return the title as plain text. Do not add quotes or any additional formatting.`;

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

    try {
      const response = await fetch(trackUrl);

      if (!response.ok) {
        throw new WorkflowNonRetryableError(
          `Failed to fetch transcript: ${response.statusText}`
        );
      }

      const text = await response.text();

      if (!text || text.trim().length === 0) {
        throw new WorkflowNonRetryableError("Transcript is empty");
      }

      return text;
    } catch (error) {
      if (error instanceof WorkflowNonRetryableError) {
        throw error;
      }
      throw new WorkflowNonRetryableError(
        `Error fetching transcript: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  });

  const generatedTitle: string | undefined = await context.run(
    "generate-title",
    async () => {
      try {
        const response = await gemini.models.generateContent({
          model: "gemini-flash-latest",
          contents: [
            {
              role: "model",
              parts: [{ text: TITLE_SYSTEM_PROMPT }],
            },
            {
              role: "user",
              parts: [{ text: transcript }],
            },
          ],
        });

        if (!response.text || response.text.trim().length === 0) {
          console.warn("Gemini returned empty title, keeping original");
          return existingVideo.title;
        }

        return response.text;
      } catch (error) {
        console.error("Error generating title with Gemini:", error);
        // Fallback to existing title on error
        return existingVideo.title;
      }
    }
  );

  await context.run("update-title", async () => {
    await db
      .update(videos)
      .set({ title: generatedTitle || existingVideo.title })
      .where(
        and(eq(videos.id, existingVideo.id), eq(videos.userId, input.userId))
      );
  });
});
