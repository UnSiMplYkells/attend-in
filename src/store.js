import { create } from "zustand";

const useStore = create((set, get) => ({
  Id: null,
  HistoryId: null,

  setId: (recordId) => set({ Id: recordId }),
  setHistoryId: (historyId) => set({HistoryId: historyId})
}));

export default useStore