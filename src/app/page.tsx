"use client";
import TypewriterComponent from "typewriter-effect";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="font-bold py-36 text-center space-y-5">
      <div className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl space-y-5 font-extrabold">
        <h1>The Best Blogging Platform</h1>
        <div className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-red-500">
          <TypewriterComponent
            options={{
              strings: [
                "Share Ideas",
                "Share Learnings",
                "Blog Writing",
                "Teach Others",
              ],
              autoStart: true,
              loop: true,
            }}
          />
        </div>
      </div>
      <div className="text-sm md:text-xl font-light text-zinc-400 mb-2">
        Share Your Ideas Through Blogs to the World!
      </div>
      <Link href="/blogs">
        <Button
          variant="premium2"
          className="md:text-lg p-4 md:p-6 rounded-full font-semibold mt-2"
        >
          Start Creating For Free
        </Button>
      </Link>
      <div className="text-zinc-400 text-xs md:text-sm font-normal">
        No payment required.
      </div>
    </div>
  );
}
