export type Department = {
  $id: string;
  code: string;
  name: string;
  nameBn: string;
};

export type Session = {
  $id: string;
  sessionName: string;
  isActive: boolean;
};

export type Section = {
  $id: string;
  sectionName: string;
  sectionNameBn?: string;
  isActive: boolean;
};

export type Class = {
  $id: string;
  name: string;
  nameBn: string;
  level: number;
  departmentId?: string;
  isActive: boolean;
};

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
};
