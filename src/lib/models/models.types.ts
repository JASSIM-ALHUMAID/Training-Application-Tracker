export interface trainApplications {
  _id: string;
  company: string;
  position: string;
  location?: string;
  status: string;
  notes?: string;
  salary?: string;
  jobUrl?: string;
  order: number;
  columnId?: string;
  tags?: string[];
  description?: string;
}

export interface Column {
  _id: string;
  name: string;
  order: number;
  trainApplications: trainApplications[];
}

export interface Board {
  _id: string;
  name: string;
  columns: Column[];
}
