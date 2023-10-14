"use client";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { trpc } from "@/app/_trpc/client";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  content: z.string().min(4),
});

interface paramsProp {
  blogId: string;
}

const CommentsForm = ({ blogId }: paramsProp) => {
  const router = useRouter();
  const createComment = trpc.createComment.useMutation({
    onSuccess: () => {
      toast.success("Comment Created Successfully");
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    createComment.mutate({ ...values, blogId: blogId });
    form.reset();
  }

  return (
    <>
      <div className="text-2xl sm:text-3xl text-transparent bg-clip-text bg-gradient-to-r from-yellow-500 to-red-500 font-bold mt-4">
        Comments
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Comment</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Your Comment" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            className="ml-2"
            disabled={isLoading}
            variant="premium2"
            type="submit"
          >
            Submit
          </Button>
        </form>
      </Form>
    </>
  );
};

export default CommentsForm;
