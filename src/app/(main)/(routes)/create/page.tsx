"use client";
import { trpc } from "@/app/_trpc/client";
import CreateBlogForm from "@/components/create-blog-form";
import { useRouter } from "next/navigation";

const BlogCreatePage = () => {
  const router = useRouter();
  const { data } = trpc.onboarded.useQuery();
  if (!data) {
    return (
      <div className="h-[500px] w-full flex items-center justify-center font-bold text-5xl">
        Loading...
      </div>
    );
  }
  if (data && !data.onboarded) {
    router.push("/onboarding");
  }

  return (
    <div className="m-4 p-6">
      <div className="text-2xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-500 to-red-500 bg-clip-text text-transparent w-fit">
        Create Blog
      </div>
      <CreateBlogForm />
    </div>
  );
};

export default BlogCreatePage;
