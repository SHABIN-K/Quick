import { create } from "zustand";

import { UserType } from "@/shared/types";

interface AuthState {
  session: UserType;
  setSession: (newUser: UserType) => void;
  clearAuth: () => void;
}

const initialState: UserType = {
  id: "",
  name: "",
  email: "",
  username: "",
  profile: "",
  confirmToken: "",
};

const useAuthStore = create<AuthState>((set) => ({
  session: initialState,
  setSession: (newUser) => set({ session: newUser }),
  clearAuth: () => set({ session: initialState }),
}));

export default useAuthStore;
