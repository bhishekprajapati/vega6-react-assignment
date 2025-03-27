import type { NextApiRequest, NextApiResponse } from "next";
import { z } from "zod";
import unsplash from "@/lib/unsplash";

export type SearchApiResponse = Awaited<
  ReturnType<typeof unsplash.search.getPhotos>
>;
export type SearchApiParams = z.infer<typeof schema>;

const schema = z.object({
  resource: z.enum(["photos"]),
  query: z.string().trim().min(1),
});

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<SearchApiResponse>
) => {
  const validation = schema.safeParse(req.query);

  if (!validation.success) {
    const status = 400;
    res.status(status).json({
      type: "error",
      status,
      errors: [
        "either `query` param is missing or `resource` param is missing",
      ],
      source: "api",
      originalResponse: {} as any,
    });
    return;
  }

  const { query, resource } = validation.data;

  if (resource === "photos") {
    const result = await unsplash.search.getPhotos({
      query,
    });
    res.status(200).json(result);
    return;
  }

  res.status(501).json({
    type: "error",
    status: 501,
    source: "api",
    errors: ["invalid resource name"],
    originalResponse: {} as any,
  });
};

export default handler;
