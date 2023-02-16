import { z } from "zod";

export const envSchema = z.object({
  TOKEN: z.string().min(46).max(46),
  CHAT_ID: z.string().min(10).max(16),
});
