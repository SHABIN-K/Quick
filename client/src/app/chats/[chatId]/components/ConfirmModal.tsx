"use client";

import toast from "react-hot-toast";
import { Dialog } from "@headlessui/react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { FiAlertTriangle } from "react-icons/fi";

import axios from "@/config/api";
import { Button } from "@/components";
import Modal from "@/components/Modal";
import useAuthStore from "@/store/useAuth";
import useConversation from "@/hooks/useConversation";

interface ConfirmModalProps {
  isOpen?: boolean;
  onClose: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { session } = useAuthStore();

  const { conversationId } = useConversation();
  const [isLoading, setIsLoading] = useState(false);

  const onDelete = useCallback(() => {
    setIsLoading(true);

    axios
      .delete(`/chats/conversations/${conversationId}`, {
        data: { email: session?.email },
      })
      .then(() => {
        onClose();
        router.push("/chats");
        router.refresh();
      })
      .catch(() => toast.error("Something went wrong!"))
      .finally(() => setIsLoading(false));
  }, [conversationId, router, onClose, session?.email]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="sm:flex sm:items-start">
          <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
            <FiAlertTriangle className="h-6 w-6 text-red-600" />
          </div>
          <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
            <Dialog.Title
              as="h3"
              className="text-base font-semibold leading-6 text-gray-900"
            >
              Delete conversation
            </Dialog.Title>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Are you sure you want to delete this conversation? This action
                cannot be undone.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <Button disabled={isLoading} danger onClick={onDelete}>
            Delete
          </Button>
          <Button disabled={isLoading} secondary onClick={onClose}>
            Cancel
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default ConfirmModal;
