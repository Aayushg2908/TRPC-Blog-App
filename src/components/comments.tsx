"use client";

import { trpc } from "@/app/_trpc/client";
import Image from "next/image";

const Comments = ({ blogId }: { blogId: string }) => {
  const comments = trpc.fetchAllComments.useQuery({ blogId });

  return (
    <div className="flex flex-col gap-2 p-4 m-4 w-full items-center">
      {comments.data?.map((comment) => (
        <>
          <div className="w-2/3 flex gap-4 p-4 bg-gray-200 dark:bg-slate-900 rounded-lg">
            <Image
              className="rounded-full"
              alt="userImage"
              src={comment.author.imageURL}
              width={50}
              height={50}
            />
            <div className="flex flex-col gap-2">
              <div className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-red-500">
                {comment.author.username}
              </div>
              <div className="opacity-70">{comment.content}</div>
            </div>
          </div>
        </>
      ))}
    </div>
  );
};

export default Comments;
