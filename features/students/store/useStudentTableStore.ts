export interface StudentListFilters {
  search?: string;
  departmentId?: string;
  classId?: string;
  status?: string;
  boardingType?: string;
}

export interface StudentTableState extends StudentListFilters {
  // Actions
  setSearch: (search: string) => void;
  setFilters: (filters: Partial<StudentListFilters>) => void;
  resetFilters: () => void;
}

import { create } from 'zustand';

export const useStudentTableStore = create<StudentTableState>((set) => ({
  search: '',
  departmentId: undefined,
  classId: undefined,
  status: 'active',
  boardingType: undefined,

  setSearch: (search) => set({ search }),
  setFilters: (filters) => set((state) => ({ ...state, ...filters })),
  resetFilters: () => set({
    search: '',
    departmentId: undefined,
    classId: undefined,
    status: 'active',
    boardingType: undefined,
  }),
}));
