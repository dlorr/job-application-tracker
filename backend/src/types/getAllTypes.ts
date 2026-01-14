export type SortableFields =
  | "createdAt"
  | "dateApplied"
  | "interviewDate"
  | "dateCompleted";

export type GetAllParams = {
  offset: number;
  limit: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
};
