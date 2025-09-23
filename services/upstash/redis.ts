import { serverEnv } from "@/env/env.server";
import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: serverEnv.UPSTASH_REDIS_REST_URL,
  token: serverEnv.UPSTASH_REDIS_REST_TOKEN,
});
