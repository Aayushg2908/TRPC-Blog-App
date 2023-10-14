"use client";
import Link from "next/link";
import { Button } from "./ui/button";
import { MenuIcon } from "lucide-react";
import { UserButton } from "@clerk/nextjs";
import { useAuth } from "@clerk/nextjs";
import { SignInButton, SignOutButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import LogoutPopover from "./logout-popover";
import { ModeToggle } from "./mode-toggle";

const Navbar = () => {
  const { userId } = useAuth();
  const router = useRouter();

  return (
    <div className="w-full h-[55px] sm:h-[70px] flex items-center justify-between">
      <Link
        href="/"
        className="p-4 font-extrabold text-2xl sm:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-red-500"
      >
        Blogger
      </Link>
      <div className="hidden sm:flex gap-2 mr-3">
        <ModeToggle />
        {!userId && (
          <Button variant="premium2">
            <SignInButton>Login</SignInButton>
          </Button>
        )}
        {userId && (
          <>
            <Link href="/create">
              <Button variant="premium2">Create</Button>
            </Link>
            <LogoutPopover />
          </>
        )}
      </div>
      <div className="sm:hidden mr-2 p-2">
        <MenuIcon className="h-6 w-6 cursor-pointer" />
      </div>
    </div>
  );
};

export default Navbar;
