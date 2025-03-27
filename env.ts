import { z } from "zod";

const env = z
  .object({
    UNSPLASH_APP_ID: z.string().trim().min(0),
    UNSPLASH_SECRET_KEY: z.string().trim().min(0),
    UNSPLASH_ACCESS_KEY: z.string().trim().min(0),
  })
  .parse(process.env);

export default env;
