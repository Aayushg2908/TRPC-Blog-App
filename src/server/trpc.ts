import { currentUser } from "@clerk/nextjs";
import { inferAsyncReturnType, initTRPC, TRPCError } from "@trpc/server";

export const createContext = async () => {
  const user = await currentUser();

  return {
    user: user,
  };
};

export type Context = inferAsyncReturnType<typeof createContext>;

const t = initTRPC.context<Context>().create();

const isAuthed = t.middleware(async (opts) => {
  const user = opts.ctx.user;

  if (!user || !user.id) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
    });
  }

  return opts.next({
    ctx: {
      userId: user.id,
      user,
    },
  });
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const privateProcedure = t.procedure.use(isAuthed);
