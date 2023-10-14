"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { trpc } from "@/app/_trpc/client";
import { useRouter } from "next/navigation";
import { ImageUpload } from "@/components/image-upload";
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";

const formSchema = z.object({
  title: z.string().min(1),
  content: z.string().min(1),
  imageURL: z.string().url(),
});

const EditBlogPage = ({ params }: { params: { blogId: string } }) => {
  const router = useRouter();
  const blog = trpc.fetchBlogbyId.useQuery(params.blogId);
  const updateBlog = trpc.editBlog.useMutation({
    onSuccess: (data) => {
      if (data.code === 200) {
        toast.success("Blog updated successfully");
        router.push(`/blogs/${params.blogId}`);
      }
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: blog.data?.blogById?.title || "",
      content: blog.data?.blogById?.content || "",
      imageURL: blog.data?.blogById?.imageURL || "",
    },
  });

  useEffect(() => {
    if (blog.data) {
      form.reset({
        title: blog.data.blogById?.title,
        content: blog.data?.blogById?.content,
        imageURL: blog.data.blogById?.imageURL,
      });
    }
  }, []);

  const isLoading = form.formState.isSubmitting;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await updateBlog.mutate({ ...values, blogId: params.blogId });
    router.push(`/blogs/${params.blogId}`);
  }

  return (
    <div className="m-4 p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Enter the title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Content</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Enter the main content"
                    {...field}
                    rows={10}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            name="imageURL"
            render={({ field }) => (
              <FormItem className="flex flex-col items-center justify-center space-y-4 col-span-2">
                <FormDescription className="font-bold text-xl">
                  Upload the Blog Image
                </FormDescription>
                <FormControl>
                  <ImageUpload
                    disabled={isLoading}
                    onChange={field.onChange}
                    value={field.value}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className="w-full"
            disabled={isLoading}
            variant="premium2"
            type="submit"
          >
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default EditBlogPage;
