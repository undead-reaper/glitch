import { DeletedObjectJSON, UserJSON } from "@clerk/nextjs/server";
import {
  VideoAssetCreatedWebhookEvent,
  VideoAssetDeletedWebhookEvent,
  VideoAssetErroredWebhookEvent,
  VideoAssetReadyWebhookEvent,
  VideoAssetTrackReadyWebhookEvent,
} from "@mux/mux-node/resources/webhooks.mjs";
import { EventSchemas, Inngest } from "inngest";

export type WebhookData<T> = {
  data: {
    data: T;
    raw: string;
    headers: Record<string, string>;
  };
};

type Events = {
  "clerk/user.created": WebhookData<UserJSON>;
  "clerk/user.updated": WebhookData<UserJSON>;
  "clerk/user.deleted": WebhookData<DeletedObjectJSON>;
  "mux/video.asset.created": WebhookData<VideoAssetCreatedWebhookEvent>;
  "mux/video.asset.ready": WebhookData<VideoAssetReadyWebhookEvent>;
  "mux/video.asset.errored": WebhookData<VideoAssetErroredWebhookEvent>;
  "mux/video.asset.track.ready": WebhookData<VideoAssetTrackReadyWebhookEvent>;
  "mux/video.asset.deleted": WebhookData<VideoAssetDeletedWebhookEvent>;
};

export const inngest = new Inngest({
  id: "glitch",
  schemas: new EventSchemas().fromRecord<Events>(),
});
