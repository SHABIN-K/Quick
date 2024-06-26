import { create } from "zustand";

interface openState {
  isLogout: boolean;
  setIsLogout: (isLoading: boolean) => void;
  isSettings: boolean;
  setIsSettings: (isLoading: boolean) => void;
  isVideoCall: boolean;
  setIsVideoCall: (isLoading: boolean) => void;
}

const useOpenStore = create<openState>((set) => ({
  isLogout: false,
  setIsLogout: (value) => set({ isLogout: value }),
  isSettings: false,
  setIsSettings: (value) => set({ isSettings: value }),
  isVideoCall: false,
  setIsVideoCall: (value) => set({ isVideoCall: value }),
}));

export default useOpenStore;
