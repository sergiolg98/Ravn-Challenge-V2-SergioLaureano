import { BadRequestError } from "../../../core/common/errors/BadRequestError";

export const MAX_ITEMS_PER_PAGE_LIMIT = 10;
export const DEFAULT_ITEMS_PER_PAGE_LIMIT = 5;

export class PaginationHelper {
  static validateLimit(initialLimit?: number): number {
    if (!initialLimit) return DEFAULT_ITEMS_PER_PAGE_LIMIT;
    return initialLimit > 0 && initialLimit <= MAX_ITEMS_PER_PAGE_LIMIT
      ? initialLimit
      : DEFAULT_ITEMS_PER_PAGE_LIMIT;
  }

  static getPage(limit: number, page?: number): number {
    let currentPage = 0;
    if (page !== null && page !== undefined) {
      currentPage = (page > 0) ? page - 1 : currentPage; // Si pide la pag 1 => 0*4 = 0 de skip
      currentPage = currentPage * limit;
    }
    return currentPage;
  }
}
