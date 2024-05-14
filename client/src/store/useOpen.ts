import { create } from "zustand";

interface openState {
  isLogout: boolean;
  setIsLogout: (isLoading: boolean) => void;
  isSettings: boolean;
  setIsSettings: (isLoading: boolean) => void;
}

const useOpenStore = create<openState>((set) => ({
  isLogout: false,
  setIsLogout: (value) => set({ isLogout: value }),
  isSettings: false,
  setIsSettings: (value) => set({ isSettings: value }),
}));

export default useOpenStore;
