import { serverEnv } from "@/env/env.server";
import { GoogleGenAI } from "@google/genai";

export const gemini = new GoogleGenAI({ apiKey: serverEnv.GEMINI_API_KEY });
