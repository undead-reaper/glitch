import { inngest } from "@/services/inngest";
import {
  createUser,
  deleteUser,
  updateUser,
} from "@/services/inngest/functions/users";
import {
  videoAssetCreated,
  videoAssetDeleted,
  videoAssetErrored,
  videoAssetReady,
  videoAssetTrackReady,
} from "@/services/inngest/functions/videos";
import { serve } from "inngest/next";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    createUser,
    updateUser,
    deleteUser,
    videoAssetCreated,
    videoAssetReady,
    videoAssetErrored,
    videoAssetDeleted,
    videoAssetTrackReady,
  ],
});
