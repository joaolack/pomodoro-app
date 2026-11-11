export type Task = {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
};

export type NewTask = Pick<Task, 'title'>;