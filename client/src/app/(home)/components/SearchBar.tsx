import { IoSearch } from "react-icons/io5";

const SearchBar = () => {
  return (
    <div className="flex bg-sky-100 rounded-lg">
      <div className="inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
        <IoSearch className="text-gray-500 w-5 h-5" />
      </div>
      <input
        type="search"
        placeholder="Search or Start new chat"
        className="w-full p-4 ps-10 text-sm text-gray-900 rounded-lg bg-sky-100 outline-none cursor-text"
      />
    </div>
  );
};

export default SearchBar;
