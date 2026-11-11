export type DateString = string;

export type Habit = {
  id: string;
  name: string;
  goal?: string;
  color: string;
  completedDates: DateString[];
  createdAt: DateString;
};

export type NewHabit = Omit<Habit, 'id' | 'completedDates' | 'createdAt'>;
