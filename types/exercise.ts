export interface Exercise {
  id: number;
  title: string;
  sets: number;
  reps: number;
  rest: string;
  video: string;
  tip: string | null;
}

export interface CompletedSets {
  [key: string]: boolean;
}