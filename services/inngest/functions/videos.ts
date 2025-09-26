import { serverEnv } from "@/env/env.server";
import { db } from "@/services/drizzle";
import { videos } from "@/services/drizzle/schema/videos";
import { inngest } from "@/services/inngest";
import { mux } from "@/services/mux";
import { eq } from "drizzle-orm";
import { NonRetriableError } from "inngest";

function verifyWebhook({
  raw,
  headers,
}: {
  raw: string;
  headers: Record<string, string>;
}) {
  return mux.webhooks.verifySignature(
    raw,
    headers,
    serverEnv.MUX_WEBHOOK_SECRET
  );
}

export const videoAssetCreated = inngest.createFunction(
  {
    id: "video-asset-created",
    name: "Mux - Video Asset Created",
  },
  {
    event: "mux/video.asset.created",
  },
  async ({ event, step }) => {
    await step.run("Verify Webhook", async () => {
      try {
        verifyWebhook(event.data);
      } catch (error) {
        throw new NonRetriableError("Invalid Webhook Signature");
      }
    });
    await step.run("Initialize Video in DB", async () => {
      const evt = event.data;
      const { id, upload_id, status, passthrough } = evt.data.data;
      await db.insert(videos).values({
        userId: passthrough as string,
        title: "Untitled Video",
        muxAssetId: id,
        muxStatus: status,
        muxUploadId: upload_id,
      });
    });
  }
);

export const videoAssetReady = inngest.createFunction(
  {
    id: "video-asset-ready",
    name: "Mux - Video Asset Ready",
  },
  {
    event: "mux/video.asset.ready",
  },
  async ({ event, step }) => {
    await step.run("Verify Webhook", async () => {
      try {
        verifyWebhook(event.data);
      } catch (error) {
        throw new NonRetriableError("Invalid Webhook Signature");
      }
    });
    await step.run("Update Video in DB", async () => {
      const evt = event.data;
      const { upload_id, playback_ids, status, id, duration } = evt.data.data;
      const playbackId = playback_ids?.[0].id;

      if (!playbackId) {
        throw new NonRetriableError("Missing Playback ID");
      } else if (!upload_id) {
        throw new NonRetriableError("Missing Upload ID");
      }

      const thumbnailUrl = `https://image.mux.com/${playbackId}/thumbnail.webp?fit_mode=smartcrop`;
      const previewUrl = `https://image.mux.com/${playbackId}/animated.gif?width=640&height=360&fit_mode=smartcrop`;
      const updatedDuration = duration ? Math.round(duration * 1000) : 0;

      await db
        .update(videos)
        .set({
          muxStatus: status,
          muxPlaybackId: playbackId,
          muxAssetId: id,
          thumbnailUrl,
          previewUrl,
          duration: updatedDuration,
        })
        .where(eq(videos.muxUploadId, upload_id));
    });
  }
);

export const videoAssetErrored = inngest.createFunction(
  {
    id: "video-asset-errored",
    name: "Mux - Video Asset Errored",
  },
  {
    event: "mux/video.asset.errored",
  },
  async ({ event, step }) => {
    await step.run("Verify Webhook", async () => {
      try {
        verifyWebhook(event.data);
      } catch (error) {
        throw new NonRetriableError("Invalid Webhook Signature");
      }
    });
    await step.run("Set Video Status in DB on Error", async () => {
      const evt = event.data;
      const { upload_id, status } = evt.data.data;

      if (!upload_id) {
        throw new NonRetriableError("Missing Upload ID");
      }

      await db
        .update(videos)
        .set({ muxStatus: status })
        .where(eq(videos.muxUploadId, upload_id));
    });
  }
);

export const videoAssetDeleted = inngest.createFunction(
  {
    id: "video-asset-deleted",
    name: "Mux - Video Asset Deleted",
  },
  {
    event: "mux/video.asset.deleted",
  },
  async ({ event, step }) => {
    await step.run("Verify Webhook", async () => {
      try {
        verifyWebhook(event.data);
      } catch (error) {
        throw new NonRetriableError("Invalid Webhook Signature");
      }
    });
    await step.run("Delete Video in DB", async () => {
      const evt = event.data;
      const { upload_id } = evt.data.data;

      if (!upload_id) {
        throw new NonRetriableError("Missing Upload ID");
      }

      await db.delete(videos).where(eq(videos.muxUploadId, upload_id));
    });
  }
);

export const videoAssetTrackReady = inngest.createFunction(
  {
    id: "video-asset-track-ready",
    name: "Mux - Video Asset Track Ready",
  },
  {
    event: "mux/video.asset.track.ready",
  },
  async ({ event, step }) => {
    await step.run("Verify Webhook", async () => {
      try {
        verifyWebhook(event.data);
      } catch (error) {
        throw new NonRetriableError("Invalid Webhook Signature");
      }
    });
    await step.run("Update Video Track in DB", async () => {
      const evt = event.data;
      type updatedData = typeof evt.data.data & {
        asset_id: string;
      };
      const data = evt.data.data as updatedData;
      const { id, status, asset_id } = data;

      if (!asset_id) {
        throw new NonRetriableError("Missing Asset ID");
      }

      await db
        .update(videos)
        .set({
          muxTrackStatus: status,
          muxTrackId: id,
        })
        .where(eq(videos.muxAssetId, asset_id));
    });
  }
);
