import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

import Modal from "@/components/Modal";
import useUsersStore from "@/store/useUsers";
import { Button, Select } from "@/components";
import usePrivateApi from "@/hooks/usePrivateApi";

interface AddMemberModalProps {
  isOpen?: boolean;
  onClose: () => void;
  groupId: string;
}

const AddMemberModal: React.FC<AddMemberModalProps> = ({
  isOpen,
  onClose,
  groupId: chatId,
}) => {
  const router = useRouter();
  const api = usePrivateApi();
  const { users } = useUsersStore();
  const [isLoading, setIsLoading] = useState(false);

  const { handleSubmit, setValue, watch } = useForm<FieldValues>({
    defaultValues: {
      members: [],
    },
  });

  const members = watch("members");

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    setIsLoading(true);
    api
      .patch("/chats/add-members", {
        ...data,
        groupId: chatId,
        isGroup: true,
      })
      .then(() => {
        router.refresh();
        onClose();
      })
      .catch(() => toast.error("Something went wrong"))
      .finally(() => setIsLoading(false));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-12">
          <div className="border-b border-gray-900/10 pb-12">
            <h2 className="text-base font-semibold leading-7 text-gray-900">
              Add members
            </h2>
            <div className="mt-10 flex flex-col gap-y-8">
              <Select
                disabled={isLoading}
                label="Members"
                options={users[0]?.map((user: { id: any; name: any }) => ({
                  value: user.id,
                  label: user.name,
                }))}
                onChange={(value) =>
                  setValue("members", value, {
                    shouldValidate: true,
                  })
                }
                value={members}
              />
            </div>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end">
          <Button
            disabled={isLoading}
            onClick={onClose}
            type="button"
            secondary
          >
            Cancel
          </Button>
          <Button disabled={isLoading} type="submit">
            Add
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddMemberModal;
