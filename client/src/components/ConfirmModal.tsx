"use client";

import { Dialog } from "@headlessui/react";
import { FiAlertTriangle } from "react-icons/fi";

import { Button } from "@/components";
import Modal from "@/components/Modal";

interface ConfirmModalProps {
  isOpen?: boolean;
  onClose: () => void;
  title: string;
  desc: string;
  buttonLabel: string;
  onClick: () => void;
  isLoading?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  title,
  desc,
  buttonLabel,
  onClick,
  isLoading,
}) => {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <div className="sm:flex sm:items-start mt-5">
          <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-sky-100 sm:mx-0 sm:h-10 sm:w-10">
            <FiAlertTriangle className="h-6 w-6 text-sky-600" />
          </div>
          <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
            <Dialog.Title
              as="h3"
              className="text-base font-semibold leading-6 text-gray-900"
            >
              {title}
            </Dialog.Title>
            <div className="mt-2">
              <p className="text-sm text-gray-500">{desc}</p>
            </div>
          </div>
        </div>
        <div className="mt-5 sm:mt-4 flex flex-row-reverse">
          <Button disabled={isLoading} onClick={onClick}>
            {buttonLabel}
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
