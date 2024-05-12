import { create } from "zustand";

interface openState {
  isOpen: boolean;
  setIsOpen: (isLoading: boolean) => void;
}

const useOpenStore = create<openState>((set) => ({
  isOpen: false,
  setIsOpen: (value) => set({ isOpen: value }),
}));

export default useOpenStore;
