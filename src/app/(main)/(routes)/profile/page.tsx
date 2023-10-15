"use client";
import { trpc } from "@/app/_trpc/client";
import CardComponent from "@/components/card-component";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Edit } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const ProfilePage = () => {
  const router = useRouter();
  const me = trpc.me.useQuery();
  const { data } = trpc.onboarded.useQuery();
  const { data: userBlogs } = trpc.userBlogs.useQuery();

  if (data === null) {
    router.push("/onboarding");
  }

  return (
    <>
      <div className="h-full w-full flex flex-col items-center justify-center mt-10 gap-10">
        <div className="font-bold text-3xl sm:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-red-500">
          My Profile
        </div>
        <Image
          className="rounded-full"
          alt="profileImage"
          src={me.data?.imageURL || "/placeholder.svg"}
          width={100}
          height={100}
        />
        <div className="font-bold text-2xl">
          NAME:{" "}
          <span className="ml-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-red-500">
            {me.data?.name}
          </span>
        </div>
        <div className="font-bold text-2xl">
          USERNAME:{" "}
          <span className="ml-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-red-500">
            {me.data?.username}
          </span>
        </div>
        <div className="font-bold text-2xl">
          BIO:{" "}
          <span className="ml-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-red-500">
            {me.data?.bio}
          </span>
        </div>
        <Button onClick={() => router.push("/profile/edit")} variant="premium2">
          Edit Profile <Edit className="ml-2 h-4 w-4" />{" "}
        </Button>
        <Separator />
        <div className="text-2xl sm:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-red-500 mt-6">
          Your Blogs
        </div>
      </div>
      <div className="mx-5 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 pb-10 mt-4">
        {userBlogs?.userBlogs.map((blog) => (
          <CardComponent blog={blog} profile={true} />
        ))}
      </div>
    </>
  );
};

export default ProfilePage;
