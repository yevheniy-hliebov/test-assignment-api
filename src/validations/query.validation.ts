import { GetUserQueryParams } from "../types/user.type";

export function validateGetUserQueryParams(total_pages: number, queryParams: GetUserQueryParams): object | undefined {
  const { page, offset, count } = queryParams;
  const fails: any = {};
  if (page) {
    const pageFails = [];
    if (isNaN(Number(page))) {
      pageFails.push("The page must be an integer.");
    }
    if (Number(page) < 0) {
      pageFails.push("The page must be at least 1.");
    }
    if (Number(page) > total_pages) {
      pageFails.push(`The page must be no more than ${total_pages}`);
    }
    if (pageFails.length > 0) {
      fails.page = pageFails;
    }
  }
  if (offset) {
    const offsetFails = [];
    if (isNaN(Number(offset))) {
      offsetFails.push("The offset must be an integer.");
    }
    if (Number(page) < 0) {
      offsetFails.push("The offset must be at least 1.");
    }
    if (offsetFails.length > 0) {
      fails.offset = offsetFails;
    }
  }
  if (count) {
    const countFails = [];
    if (isNaN(Number(count))) {
      countFails.push("The count must be an integer.");
    }
    if (Number(page) < 0) {
      countFails.push("The count must be at least 1.");
    }
    if (countFails.length > 0) {
      fails.count = countFails;
    }
  }
  
  return Object.keys(fails).length > 0 ? fails : undefined;
}