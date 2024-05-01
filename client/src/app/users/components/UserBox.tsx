import React, { useCallback, useState } from "react";
import { useRouter } from "next/navigation";

import { UserType } from "@/shared/types";
import Avatar from "@/components/Avatar";
import LoadingModal from "@/components/LoadingModal";
import { getChats } from "@/actions/getChats";

interface UserBoxProps {
  data: UserType;
  currentUser: string;
}
const UserBox: React.FC<UserBoxProps> = ({ data, currentUser }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const handleClick = useCallback(async () => {
    //setIsLoading(true);
    const response = await getChats({
      userId: currentUser,
      chatId: data.id as string,
    });

    console.log(response.data);
  }, [currentUser, data.id]);

  return (
    <>
      {isLoading && <LoadingModal />}
      <div
        onClick={handleClick}
        className="w-full relative flex items-center space-x-3 bg-white p-3 hover:bg-neutral-100 rounded-lg transition cursor-pointer"
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
