import { create } from "zustand";

interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  profile: string;
  accessToken: string;
}

interface AuthState {
  user: User;
  setUser: (newUser: User) => void;
  clearAuth: () => void;
}

const initialState: User = {
  id: "",
  name: "",
  email: "",
  username: "",
  profile: "",
  accessToken: "",
};

const useAuthStore = create<AuthState>((set) => ({
  user: initialState,
  setUser: (newUser) => {
    console.log(newUser);
    set({ user: newUser });
  },
  clearAuth: () => set({ user: initialState }),
}));

export default useAuthStore;
