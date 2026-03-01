
export interface Entry {
  submission_id: number | null;
  entry_id: string | null;
  origin: string;
  original: string | null;
  submitted_at: string | null;
  approved_at: string | null;
  categories: string[];
  examples: string[];
  forms: string[];
  meanings: string[];
  sources: string[];
}
