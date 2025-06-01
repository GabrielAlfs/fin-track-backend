export interface Paginated<T> {
  items: Array<T>;
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}
