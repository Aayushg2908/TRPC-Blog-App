"use client";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { SignOutButton } from "@clerk/nextjs";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import Image from "next/image";
import Link from "next/link";
import { trpc } from "@/app/_trpc/client";

const LogoutPopover = () => {
  const router = useRouter();
  const me = trpc.me.useQuery();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Image
          alt="profile"
          src={me.data?.imageURL || "/placeholder.svg"}
          width={40}
          height={40}
          className="rounded-full cursor-pointer"
        />
      </PopoverTrigger>
      <PopoverContent className="mt-2 mr-2 w-[200px]">
        <div className="flex flex-col gap-2">
          <Link href="/profile">
            <Button className="w-full" variant="default">
              My profile
            </Button>
          </Link>
          <Button variant="default">
            <SignOutButton signOutCallback={() => router.push("/")}>
              Logout
            </SignOutButton>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default LogoutPopover;
