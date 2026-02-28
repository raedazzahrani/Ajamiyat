
export interface Entry {
  submission_id: number | null;
  entry_id: string | null;
  origin: string;
  original: string | null;
  submitted_at: string | null;
  approved_at: string | null;
  categories: string[] | null;
  examples: string[] | null;
  forms: string[];
  meanings: string[] | null;
  sources: string[] | null;
}
