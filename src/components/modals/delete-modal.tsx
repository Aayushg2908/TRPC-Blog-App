"use client";
import { useStoreModal } from "@/hooks/use-store-modal";
import { Modal } from "../ui/modal";
import { Button } from "../ui/button";
import { useParams, useRouter } from "next/navigation";
import { trpc } from "@/app/_trpc/client";
import { toast } from "react-hot-toast";

export const DeleteModal = () => {
  const router = useRouter();
  const params: any = useParams();
  const storeModal = useStoreModal();

  const deleteBlog = trpc.deleteBlog.useMutation({
    onSuccess: (data) => {
      if (data.code === 200) {
        toast.success("Blog Deleted Successfully");
        storeModal.onClose();
        router.push("/blogs");
      }
    },
  });

  const handleDelete = async () => {
    await deleteBlog.mutate({ blogId: params.blogId });
  };

  return (
    <Modal
      title="Delete Blog"
      description="Are You Sure You Want To Delete This Blog?"
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      <div className="flex justify-between">
        <Button variant="destructive" onClick={handleDelete}>
          Yes
        </Button>
        <Button variant="default" onClick={storeModal.onClose}>
          No
        </Button>
      </div>
    </Modal>
  );
};
