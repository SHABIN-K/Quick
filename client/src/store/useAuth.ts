import { UserType } from "@/shared/types";
import { create } from "zustand";

interface AuthState {
  user: UserType;
  setUser: (newUser: UserType) => void;
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
  user: initialState,
  setUser: (newUser) => set({ user: newUser }),
  clearAuth: () => set({ user: initialState }),
}));

export default useAuthStore;
