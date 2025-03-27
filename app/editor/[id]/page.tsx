import { CardBody, CardRoot } from "@chakra-ui/react";

import Editor from "@/components/editor";
import unsplash from "@/lib/unsplash";

type EditorPageProps = {
  params: Promise<{
    id: string;
  }>;
};

const EditorPage = async ({ params }: EditorPageProps) => {
  const { id } = await params;

  const res = await unsplash.photos.get({
    photoId: id,
  });

  if (res.type === "error") {
    return (
      <CardRoot>
        <CardBody textAlign="center">{res.errors.join(",")}</CardBody>
      </CardRoot>
    );
  }

  return <Editor data={res.response} />;
};

export default EditorPage;
