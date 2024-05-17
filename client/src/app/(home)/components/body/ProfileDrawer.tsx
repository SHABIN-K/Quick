"use client";

import { format } from "date-fns";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useCallback, useMemo, useState } from "react";
import { IoClose, IoTrash, IoPersonAddOutline } from "react-icons/io5";

import UserBox from "../UserBox";
import Avatar from "@/components/Avatar";
import useAuthStore from "@/store/useAuth";
import useOtherUser from "@/hooks/useOtherUser";
import usePrivateApi from "@/hooks/usePrivateApi";
import AvatarGroup from "@/components/AvatarGroup";
import { Conversation, User } from "@/shared/types";
import ConfirmModal from "@/components/ConfirmModal";
import useConversation from "@/hooks/useConversation";
import useActiveListStore from "@/store/useActiveList";
import AddMemberModal from "../modal/AddMembetModal";

interface ProfileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  data: Conversation & {
    users: User[];
  };
}

const ProfileDrawer: React.FC<ProfileDrawerProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const router = useRouter();
  const api = usePrivateApi();
  const { session } = useAuthStore();
  const { members } = useActiveListStore();
  const { conversationId } = useConversation();

  const otherUser = useOtherUser(data);

  const [isLoading, setIsLoading] = useState(false);
  const [addMember, setAddMember] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const isActive = members.indexOf(otherUser?.email!) !== -1;

  const joinedDate = useMemo(() => {
    return format(new Date(otherUser.createdAt), "PP");
  }, [otherUser.createdAt]);

  const title = useMemo(() => {
    return data.name || otherUser.name;
  }, [data.name, otherUser.name]);

  const statusText = useMemo(() => {
    if (data.isGroup) {
      return `${data.users.length} members`;
    }
    return isActive ? "Active" : "Offline";
  }, [data, isActive]);

  const onDelete = useCallback(() => {
    setIsLoading(true);

    api
      .delete(`/chats/delete-chat/${conversationId}`)
      .then(() => {
        onClose();
        router.push("/chats");
        router.refresh();
      })
      .catch(() => toast.error("Something went wrong!"))
      .finally(() => setIsLoading(false));
  }, [api, conversationId, onClose, router]);
  return (
    <>
      <ConfirmModal
        isOpen={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Delete conversation"
        desc="Are you sure you want to delete this conversation? This action
        cannot be undone."
        buttonLabel="Delete"
        onClick={onDelete}
        isLoading={isLoading}
      />
      <AddMemberModal
        currentUser={session?.email as string}
        isOpen={addMember}
        onClose={() => setAddMember(false)}
      />
      <Transition.Root show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-40" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                    <div className="flex h-full flex-col overflow-hidden bg-white py-6 shadow-xl  overflow-y-auto body-scroll">
                      <div className="px-4 sm:px-6">
                        <div className="flex items-start justify-end">
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              onClick={onClose}
                              type="button"
                              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
                            >
                              <span className="sr-only">Close panel</span>
                              <IoClose size={24} />
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="relative mt-6 flex-1 px-4 sm:px-6">
                        <div className="flex flex-col items-center">
                          <div className="mb-4">
                            {data.isGroup ? (
                              <AvatarGroup users={data.users} />
                            ) : (
                              <Avatar user={otherUser} />
                            )}
                          </div>
                          <div>{title}</div>
                          <div className="text-sm text-gray-500">
                            {statusText}
                          </div>
                          <div className="flex gap-10 my-8">
                            {data.isGroup && (
                              <div
                                onClick={() => setAddMember(true)}
                                className="flex flex-col gap-3 items-center cursor-pointer hover:opacity-75"
                              >
                                <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center">
                                  <IoPersonAddOutline size={20} />
                                </div>
                                <div className="text-sm font-light text-neutral-600">
                                  Add member
                                </div>
                              </div>
                            )}
                            <div
                              onClick={() => setConfirmOpen(true)}
                              className="flex flex-col gap-3 items-center cursor-pointer hover:opacity-75"
                            >
                              <div className="w-10 h-10 bg-neutral-100 rounded-full flex items-center justify-center">
                                <IoTrash size={20} />
                              </div>
                              <div className="text-sm font-light text-neutral-600">
                                Delete
                              </div>
                            </div>
                          </div>
                          <div className="w-full pb-5 pt-5 sm:px-0 sm:pt-0">
                            <dl className="space-y-8 px-4 sm:space-y-6 sm:px-6">
                              {data.isGroup && (
                                <div>
                                  <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">
                                    Emails
                                  </dt>
                                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2 overflow-auto">
                                    {data.users.map((user) => (
                                      <UserBox
                                        key={user.id}
                                        data={user as User}
                                        currentUser={session?.email as string}
                                      />
                                    ))}
                                  </dd>
                                </div>
                              )}
                              {!data.isGroup && (
                                <div>
                                  <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">
                                    Email
                                  </dt>
                                  <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                                    {otherUser.email}
                                  </dd>
                                </div>
                              )}
                              {!data.isGroup && (
                                <>
                                  <hr />
                                  <div>
                                    <dt className="text-sm font-medium text-gray-500 sm:w-40 sm:flex-shrink-0">
                                      Joined
                                    </dt>
                                    <dd className="mt-1 text-sm text-gray-900 sm:col-span-2">
                                      <time dateTime={joinedDate}>
                                        {joinedDate}
                                      </time>
                                    </dd>
                                  </div>
                                </>
                              )}
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

export default ProfileDrawer;
