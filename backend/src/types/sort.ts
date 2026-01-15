import { SORT_ORDER } from "../constants/sort";
import { SORTABLE_FIELDS } from "../constants/sortableFields";

export type SortOrder = (typeof SORT_ORDER)[keyof typeof SORT_ORDER];

export type SortableField =
  (typeof SORTABLE_FIELDS)[keyof typeof SORTABLE_FIELDS];
