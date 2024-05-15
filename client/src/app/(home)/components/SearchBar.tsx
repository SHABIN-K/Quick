import Fuse from "fuse.js";
import { IoSearch } from "react-icons/io5";
import { ChangeEvent, useMemo } from "react";

import { FullConversationType, User } from "@/shared/types";

interface SearchInputProps {
  value?: string;
  data?: FullConversationType[] | User[] | undefined;
  setSearchText: React.Dispatch<React.SetStateAction<string>>;
  setSearchedData: React.Dispatch<
    React.SetStateAction<FullConversationType[] | User[] | undefined>
  >;
  pathname: string;
}

interface ChatsOptionsType {
  includeScore: boolean;
  keys: {
    name: string;
    getFn: (value: FullConversationType) => string;
  }[];
  threshold: number;
}
interface UserOptionsType {
  includeScore: boolean;
  keys: {
    name: string;
    getFn: (value: User) => string;
  }[];
  threshold: number;
}

const SearchBar: React.FC<SearchInputProps> = ({
  value,
  data,
  setSearchText,
  setSearchedData,
  pathname,
}) => {
  const fuse = useMemo(() => {
    const ChatsOptions: ChatsOptionsType = {
      includeScore: true,
      keys: [
        {
          name: "name",
          getFn: (value) => value.users.map((user) => user.name).join(" "),
        },
        {
          name: "username",
          getFn: (value) => value.users.map((user) => user.username).join(" "),
        },
        {
          name: "email",
          getFn: (value) => value.users.map((user) => user.email).join(" "),
        },
        {
          name: "Group_name",
          getFn: (value) => value?.name ?? "",
        },
      ],
      threshold: 0.2,
    };

    const UserOptions: UserOptionsType = {
      includeScore: true,
      keys: [
        { name: "name", getFn: (value) => value.name as string },
        { name: "username", getFn: (value) => value.username as string },
        { name: "email", getFn: (value) => value.email as string },
      ],
      threshold: 0.2,
    };

    if (pathname === "/users") {
      return new Fuse(data as User[], UserOptions);
    } else {
      return new Fuse(data as FullConversationType[], ChatsOptions);
    }
  }, [data, pathname]);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);

    // Perform search and update the searched data
    const result = fuse.search(e.target.value).map((item) => item.item);
    setSearchedData(result || []);
  };
  return (
    <div className="flex bg-sky-100 rounded-lg">
      <div className="inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
        <IoSearch className="text-gray-500 w-5 h-5" />
      </div>
      <input
        type="search"
        value={value}
        onChange={handleSearch}
        placeholder="Search or Start new chat"
        className="w-full p-4 ps-10 text-sm font-medium text-gray-900 rounded-lg bg-sky-100 outline-none cursor-text"
      />
    </div>
  );
};

export default SearchBar;
