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
import { Textarea } from "@/components/ui/textarea";
import { useEffect } from "react";
import { ImageUpload } from "@/components/image-upload";
import { trpc } from "@/app/_trpc/client";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(1),
  username: z.string().min(1).max(50),
  imageURL: z.string().url(),
  bio: z.string().min(5).max(160),
});

const EditProfilePage = () => {
  const router = useRouter();
  const { data } = trpc.me.useQuery();
  const editProfile = trpc.editProfile.useMutation({
    onSuccess: () => {
      toast.success("Profile updated successfully");
      router.push("/profile");
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: data?.name || "",
      username: data?.username || "",
      imageURL: data?.imageURL || "",
      bio: data?.bio || "",
    },
  });

  useEffect(() => {
    if (data) {
      form.reset({
        name: data?.name,
        username: data?.username,
        imageURL: data?.imageURL,
        bio: data?.bio,
      });
    }
  }, []);

  const isLoading = form.formState.isSubmitting;

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await editProfile.mutate(values);
  }

  return (
    <div className="m-4 p-6">
      <div className="text-2xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-yellow-500 to-red-500 bg-clip-text text-transparent w-fit">
        Edit Your Profile
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Your name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Enter Your Username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Textarea placeholder="Enter Your bio" {...field} />
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
                  Change your profile picture
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
            Edit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default EditProfilePage;
