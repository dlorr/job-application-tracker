import type { SortableField, SortOrder } from "./sort";

export type GetAllParams = {
  offset: number;
  limit: number;
  sortBy: SortableField;
  sortOrder: SortOrder;
  filters: {
    company?: string;
    jobPosition?: string;
    status?: string;
    progress?: string;
  };
};
