import { createApi } from "unsplash-js";
import env from "@/env";

const unsplash = createApi({
  accessKey: env.UNSPLASH_ACCESS_KEY,
  fetch: fetch,
});

export default unsplash;
