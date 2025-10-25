
export enum Status {
  Pending = 'pending',
  InProgress = 'in-progress',
  Completed = 'completed',
}

export interface Task {
  id: string;
  text: string;
  status: Status;
  date: string; // YYYY-MM-DD
  folder?: string;
}
