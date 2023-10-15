"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { trpc } from "@/app/_trpc/client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Cloud } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

interface CardComponentProps {
  blog: any;
  profile?: boolean;
}

const CardComponent = ({ blog, profile }: CardComponentProps) => {
  const router = useRouter();
  const likes = trpc.LikeBlog.useMutation({
    onSuccess: (data) => {
      if (data.code === 201) {
        toast.success("Unliked the blog");
        router.refresh();
      } else {
        toast.success("Liked the blog");
        router.refresh();
      }
    },
  });
  const { data } = trpc.hasCurrentUserLiked.useQuery({ blogId: blog.id });

  return (
    <Card key={blog.id} className="rounded-xl cursor-pointer">
      <Link href={`/blogs/${blog.id}`}>
        <CardHeader className="flex items-center justify-center text-center text-muted-foreground">
          <p className="font-bold">{blog.title}</p>
        </CardHeader>
        <CardContent className="flex items-center justify-center">
          <div className="relative w-32 h-32">
            <Image
              src={blog.imageURL}
              fill
              className="rounded-xl object-cover"
              alt="Character"
            />
          </div>
        </CardContent>
      </Link>
      <CardFooter className="flex justify-between">
        <div
          className="flex flex-col items-center justify-center"
          onClick={async () => {
            await likes.mutate({ blogId: blog.id });
          }}
        >
          {data?.hasCurrentUserLiked ? (
            <Heart className="w-5 h-5 fill-red-600" />
          ) : (
            <Heart className="w-5 h-5" />
          )}
          {blog.likes.length}
        </div>
        <div className="flex flex-col items-center justify-center">
          <Cloud className="w-5 h-5" />
          {blog.comments.length}
        </div>
      </CardFooter>
      {!profile && <CardFooter>Created By:- {blog.author.username}</CardFooter>}
    </Card>
  );
};

export default CardComponent;
