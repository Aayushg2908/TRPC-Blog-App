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
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import CardComponent from "@/components/card-component";

const BlogPage = () => {
  const router = useRouter();
  const blogs = trpc.fetchBlogs.useQuery();
  const { userId } = useAuth();

  if (!blogs.data) {
    return (
      <div className="h-[500px] w-full flex items-center justify-center font-bold text-5xl">
        Loading...
      </div>
    );
  }

  console.log(userId);

  return (
    <div className="mx-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 pb-10 mt-4">
      {blogs.data.map((blog) => (
        <CardComponent blog={blog}  />
      ))}
    </div>
  );
};

export default BlogPage;
