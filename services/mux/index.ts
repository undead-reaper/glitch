import { serverEnv } from "@/env/env.server";
import { Mux } from "@mux/mux-node";

export const mux = new Mux({
  tokenId: serverEnv.MUX_TOKEN_ID,
  tokenSecret: serverEnv.MUX_TOKEN_SECRET,
});
