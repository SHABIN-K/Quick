import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

import { User } from "@/shared/types";
import Avatar from "@/components/Avatar";
import usePrivateApi from "@/hooks/usePrivateApi";
import LoadingModal from "@/components/LoadingModal";

interface UserBoxProps {
  data: User;
  currentUser: string;
}

const UserBox: React.FC<UserBoxProps> = ({ data, currentUser }) => {
  const api = usePrivateApi();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = useCallback(async () => {
    setIsLoading(true);

    try {
      if (currentUser === data.email) {
        toast("You cannot start a chat with yourself.");
      } else {
        const response = await api.post("/chats/create-chat", {
          chatId: data.id as string,
        });

        const chatId = response.data.data.id;
        if (chatId) {
          router.push(`/chats/${chatId}`);
        }
      }
    } catch (error) {
      console.error("Error fetching chats:", error);
    } finally {
      setIsLoading(false);
    }
  }, [api, currentUser, data.email, data.id, router]);

  return (
    <>
      {isLoading && <LoadingModal />}
      <div
        onClick={handleClick}
        className="w-full relative flex items-center space-x-3 p-3 hover:bg-sky-100 rounded-lg transition cursor-pointer"
      >
        <Avatar user={data} />
        <div className="min-w-0 flex-1">
          <div className="focus:outline-none">
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm font-medium text-gray-900">{data.name}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserBox;
