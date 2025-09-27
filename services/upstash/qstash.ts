import { serverEnv } from "@/env/env.server";
import { Client } from "@upstash/workflow";

export const qstash = new Client({ token: serverEnv.QSTASH_TOKEN });
