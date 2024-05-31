"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import Modal from "../Modal";
import Button from "../Button";
import axios from "@/config/api";
import Input from "../inputs/Input";
import { UserType } from "@/shared/types";

interface SettingsModalProps {
  isOpen?: boolean;
  onClose: () => void;
  currentUser: UserType;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  currentUser,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: currentUser?.name,
      username: currentUser?.username,
      email: currentUser?.email,
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);

    axios
      .put("/users/update-user", {
        name: data?.name,
        email: data?.email,
        username: data?.username,
      })
      .then(() => {
        toast.success("user updated succesfully");
        router.refresh();
        onClose();
      })
      .catch(() => toast.error("Something went wrong!"))
      .finally(() => setIsLoading(false));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-12 mt-5 sm:mt-0">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Profile
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-600">
              Edit your public information.
            </p>

            <div className="mt-10 flex flex-col gap-y-8">
              <Input
                disabled={isLoading}
                label="Name"
                id="name"
                errors={errors}
                required
                register={register}
              />
              <Input
                disabled={isLoading}
                label="Username"
                id="username"
                errors={errors}
                required
                register={register}
              />
              <Input
                disabled={isLoading}
                label="Email address"
                id="email"
                type="email"
                errors={errors}
                required
                register={register}
              />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end">
            <Button disabled={isLoading} secondary onClick={onClose}>
              Cancel
            </Button>
            <Button disabled={isLoading} type="submit">
              Save
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};

export default SettingsModal;
