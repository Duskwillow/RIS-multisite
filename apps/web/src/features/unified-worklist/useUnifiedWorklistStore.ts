import { create } from 'zustand';

interface WorklistItem {
  patientName: string;
  examDescription: string;
  siteName: string;
  isUrgent: boolean;
  examDate: string;
}

interface UnifiedWorklistState {
  worklist: WorklistItem[];
  searchTerm: string;
  filteredWorklist: WorklistItem[];
  setWorklist: (worklist: WorklistItem[]) => void;
  setSearchTerm: (searchTerm: string) => void;
}

export const useUnifiedWorklistStore = create<UnifiedWorklistState>((set, get) => ({
  worklist: [],
  searchTerm: '',
  filteredWorklist: [],
  setWorklist: (worklist) => {
    set({ worklist, filteredWorklist: get().filterWorklist(worklist, get().searchTerm) });
  },
  setSearchTerm: (searchTerm) => {
    set({ searchTerm, filteredWorklist: get().filterWorklist(get().worklist, searchTerm) });
  },
  filterWorklist: (worklist: WorklistItem[], searchTerm: string) => {
    if (!searchTerm) {
      return worklist;
    }
    return worklist.filter(item =>
      item.patientName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  },
}));
