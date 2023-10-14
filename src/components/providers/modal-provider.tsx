"use client";

import { useEffect, useState } from "react";

import { DeleteModal } from "@/components/modals/delete-modal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <DeleteModal />
    </>
  );
};
