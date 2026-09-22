import type { ILinks } from "./common";

export interface IDisciplineRecord {
  id: number;
  name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  plan_disciplines?: unknown[];
  user_disciplines?: unknown[];
}

export interface IDisciplineNew {
  name: string;
  is_active: boolean;
}

export interface IGetDisciplinesResponse {
  success: true;
  data: IDisciplineRecord[];
  links?: ILinks;
  pages?: number[];
  total?: number;
}

export interface IGetDisciplineResponse {
  success: true;
  data: IDisciplineRecord;
}
