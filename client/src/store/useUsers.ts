import { create } from "zustand";

import { User } from "@/shared/types";

interface UsersState {
  users: User[];
  addUser: (newUser: User) => void;
}

const useUsersStore = create<UsersState>((set) => ({
  users: [],
  addUser: (value) => set(() => ({ users: [value] })),
}));

export default useUsersStore;
