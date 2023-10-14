"use client";
import { Separator } from "@/components/ui/separator";
import { trpc } from "@/app/_trpc/client";
import Image from "next/image";
import { useEffect, useState } from "react";
import Comments from "@/components/comments";
import CommentsForm from "@/components/comment-form";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import { useStoreModal } from "@/hooks/use-store-modal";

const BlogByIdPage = ({ params }: { params: { blogId: string } }) => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const blog = trpc.fetchBlogbyId.useQuery(params.blogId);
  const { data } = trpc.onboarded.useQuery();
  const { data: blogData } = trpc.blogOwner.useQuery({ blogId: params.blogId });
  const storeModal = useStoreModal();

  if (data === null) {
    router.push("/onboarding");
  }

  if (!blog.data?.blogById) {
    return (
      <div className="h-[500px] w-full flex items-center justify-center font-bold text-5xl">
        Loading...
      </div>
    );
  }

  const handleClick = () => {
    storeModal.onOpen();
  };

  return (
    <div className="mt-10 h-full w-full flex flex-col gap-2 items-center justify-center">
      {blogData?.blogOwner && (
        <div className="flex justify-between gap-4 mb-4 items-center">
          <Button variant="premium2" onClick={()=>router.push(`/blogs/${params.blogId}/edit`)}>
            Edit{" "}
            <span className="ml-1">
              <Edit />
            </span>
          </Button>
          <Button variant="premium2" onClick={handleClick}>
            Delete{" "}
            <span className="ml-1">
              <Trash2 />
            </span>
          </Button>
        </div>
      )}
      <div className="font-bold text-3xl sm:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-red-500 mb-4">
        {blog.data.blogById.title}
      </div>
      <Image
        alt="blogImage"
        src={blog.data.blogById.imageURL}
        width={400}
        height={400}
        className="mt-4"
      />
      <div className="text-xl font-bold mt-4">{blog.data.blogById.content}</div>
      <Separator className="mt-4 w-2/3" />
      <CommentsForm blogId={params.blogId} />
      <Comments blogId={params.blogId} />
    </div>
  );
};

export default BlogByIdPage;
