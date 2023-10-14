import { z } from "zod";

import { publicProcedure, router, privateProcedure } from "./trpc";
import prismadb from "@/lib/prismadb";
import BlogByIdPage from "@/app/(main)/(routes)/blogs/[blogId]/page";

export const appRouter = router({
  onboarding: privateProcedure
    .input(
      z.object({
        name: z.string(),
        username: z.string().min(1),
        imageURL: z.string(),
        bio: z.string(),
      })
    )
    .mutation(async (opts) => {
      const { name, username, imageURL, bio } = opts.input;
      if (!name || !username || !imageURL || !bio) {
        return { code: 400, message: "All fields are required" };
      }
      const userExists = await prismadb.user.findFirst({
        where: { userId: opts.ctx.userId },
      });
      if (userExists) {
        return { code: 401, message: "User already exists" };
      }
      const usernameExists = await prismadb.user.findUnique({
        where: { username: username },
      });
      if (usernameExists) {
        return { code: 400, message: "Username already taken" };
      }
      const user = await prismadb.user.create({
        data: {
          userId: opts.ctx.userId,
          name: name,
          username: username,
          imageURL: imageURL,
          bio: bio,
          onboarded: true,
        },
      });
      return {
        code: 200,
        user: user,
      };
    }),
  onboarded: privateProcedure.query(async (opts) => {
    const onboarded = await prismadb.user.findFirst({
      where: { userId: opts.ctx.userId },
      select: { onboarded: true },
    });

    return onboarded;
  }),
  me: privateProcedure.query(async (opts) => {
    const user = await prismadb.user.findFirst({
      where: { userId: opts.ctx.userId },
    });
    return user;
  }),
  editProfile: privateProcedure
    .input(
      z.object({
        name: z.string(),
        username: z.string().min(1),
        imageURL: z.string(),
        bio: z.string(),
      })
    )
    .mutation(async (opts) => {
      const { name, username, imageURL, bio } = opts.input;
      if (!name || !username || !imageURL || !bio) {
        return { code: 400, message: "All fields are required" };
      }
      const user = await prismadb.user.update({
        where: { userId: opts.ctx.userId, username: opts.input.username },
        data: {
          name: name,
          username: username,
          imageURL: imageURL,
          bio: bio,
        },
      });
      return {
        code: 200,
        user: user,
      };
    }),
  createBlog: privateProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
        imageURL: z.string(),
      })
    )
    .mutation(async (opts) => {
      const { title, content, imageURL } = opts.input;
      if (!title || !content || !imageURL) {
        return { code: 400, message: "All fields are required" };
      }
      const user = await prismadb.user.findFirst({
        where: { userId: opts.ctx.userId },
        select: {
          id: true,
        },
      });
      if (!user) {
        return { code: 401, message: "User not found" };
      }
      const blog = await prismadb.post.create({
        data: {
          title: title,
          content: content,
          imageURL: imageURL,
          authorId: user.id,
        },
      });
      return {
        code: 200,
        blog: blog,
      };
    }),
  fetchBlogs: privateProcedure.query(async () => {
    const blogs = await prismadb.post.findMany({
      include: {
        likes: true,
        comments: true,
      },
    });
    return blogs;
  }),
  fetchBlogbyId: privateProcedure
    .input(z.string().min(1))
    .query(async (opts) => {
      const blogById = await prismadb.post.findUnique({
        where: {
          id: opts.input,
        },
        include: {
          likes: true,
          comments: true,
        },
      });
      return {
        code: 200,
        blogById,
      };
    }),
  createComment: privateProcedure
    .input(
      z.object({
        content: z.string().min(4),
        blogId: z.string().min(1),
      })
    )
    .mutation(async (opts) => {
      const { content, blogId } = opts.input;
      if (!content || !blogId) {
        return { code: 400, message: "All fields are required" };
      }
      const user = await prismadb.user.findFirst({
        where: { userId: opts.ctx.userId },
        select: {
          id: true,
        },
      });
      if (!user) {
        return { code: 401, message: "User not found" };
      }
      const comment = await prismadb.comment.create({
        data: {
          content: content,
          authorId: user.id,
          postId: blogId,
        },
      });
      return {
        code: 200,
        comment: comment,
      };
    }),
  fetchAllComments: privateProcedure
    .input(
      z.object({
        blogId: z.string().min(1),
      })
    )
    .query(async (opts) => {
      const comments = await prismadb.comment.findMany({
        where: {
          postId: opts.input.blogId,
        },
        include: {
          author: {
            select: {
              username: true,
              imageURL: true,
            },
          },
        },
      });
      return comments;
    }),
  LikeBlog: privateProcedure
    .input(
      z.object({
        blogId: z.string().min(1),
      })
    )
    .mutation(async (opts) => {
      const user = await prismadb.user.findFirst({
        where: { userId: opts.ctx.userId },
        select: {
          id: true,
        },
      });
      if (!user) {
        return { code: 401, message: "User not found" };
      }
      const likeExists = await prismadb.like.findFirst({
        where: {
          authorId: user.id,
          postId: opts.input.blogId,
        },
      });
      if (likeExists) {
        const like = await prismadb.like.deleteMany({
          where: {
            authorId: user.id,
            postId: opts.input.blogId,
          },
        });
        return {
          code: 201,
          like: like,
        };
      }
      const like = await prismadb.like.create({
        data: {
          authorId: user.id,
          postId: opts.input.blogId,
        },
      });

      return {
        code: 200,
        like: like,
      };
    }),
  hasCurrentUserLiked: privateProcedure
    .input(
      z.object({
        blogId: z.string().min(1),
      })
    )
    .query(async (opts) => {
      const like = await prismadb.like.findFirst({
        where: {
          postId: opts.input.blogId,
        },
        include: {
          author: true,
        },
      });
      if (like?.author.userId === opts.ctx.userId) {
        return {
          code: 200,
          hasCurrentUserLiked: true,
        };
      }
      return {
        code: 201,
        hasCurrentUserLiked: false,
      };
    }),
  deleteBlog: privateProcedure
    .input(
      z.object({
        blogId: z.string().min(1),
      })
    )
    .mutation(async (opts) => {
      const deleteBlog = await prismadb.post.delete({
        where: {
          id: opts.input.blogId,
        },
      });
      return {
        code: 200,
        deleteBlog: deleteBlog,
      };
    }),
  blogOwner: privateProcedure
    .input(
      z.object({
        blogId: z.string().min(1),
      })
    )
    .query(async (opts) => {
      const user = await prismadb.user.findFirst({
        where: { userId: opts.ctx.userId },
        select: {
          id: true,
        },
      });
      const blogOwner = await prismadb.post.findFirst({
        where: {
          id: opts.input.blogId,
        },
        select: {
          authorId: true,
        },
      });
      if (user?.id === blogOwner?.authorId) {
        return {
          code: 200,
          blogOwner: true,
        };
      }
      return {
        code: 201,
        blogOwner: false,
      };
    }),
  editBlog: privateProcedure
    .input(
      z.object({
        title: z.string().min(1),
        content: z.string().min(1),
        imageURL: z.string().min(1),
        blogId: z.string().min(1),
      })
    )
    .mutation(async (opts) => {
      const { title, content, imageURL, blogId } = opts.input;
      if (!title || !content || !imageURL || !blogId) {
        return { code: 400, message: "All fields are required" };
      }
      const blog = await prismadb.post.update({
        where: {
          id: blogId,
        },
        data: {
          title: title,
          content: content,
          imageURL: imageURL,
        },
      });
      return {
        code: 200,
        blog: blog,
      };
    }),
});
export type AppRouter = typeof appRouter;
