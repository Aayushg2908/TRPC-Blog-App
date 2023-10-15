import { appRouter } from "@/server"
import { fetchRequestHandler } from "@trpc/server/adapters/fetch"
import { createContext } from "@/server/trpc"

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "https://trpc-blog-3eb0ktvtd-aayushg2908.vercel.app/api/trpc",
    req,
    router: appRouter,
    createContext: createContext,
  })

export { handler as GET, handler as POST }