import { create } from "zustand";
import { CallInfo } from "@/shared/types";

interface ActiveListStore {
  members: string[];
  call: CallInfo[];
  addCall: (info: CallInfo) => void;
  add: (id: string) => void;
  remove: (id: string) => void;
  set: (ids: string[]) => void;
}

const useActiveListStore = create<ActiveListStore>((set) => ({
  members: [],
  call: [],
  addCall: (info) => set((state) => ({ call: [...state.call, info] })),
  add: (id) => set((state) => ({ members: [...state.members, id] })),
  remove: (id) =>
    set((state) => ({
      members: state.members.filter((memberId) => memberId !== id),
    })),
  set: (ids) => set({ members: ids }),
}));

export default useActiveListStore;
