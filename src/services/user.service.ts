import { NextFunction, Request, Response } from "express";
import Knex, { Knex as iKnex } from "knex";
import configConnection from '../configs/db.config';
import HttpException from "../exceptions/http.exception";
import { validateGetUserQueryParams } from "../validations/query.validation";
import { GetUserQueryParams } from "../types/user.type";

class UserService {
  private static instance: UserService;
  private static knex = Knex(configConnection);
  private defaultCount = 10;
  constructor() { }

  public static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  public async getUsers(queryParams: GetUserQueryParams) {
    try {
      const { page, offset, count } = queryParams;

      let [{ total }] = await UserService.knex.count('* as total').from('users');
      let total_pages = Math.ceil(Number(total) / (count ? Number(count) : 10));

      const fails = validateGetUserQueryParams(total_pages, queryParams);
      if (fails) {
        throw new HttpException('Validation failed', 422, fails);
      }

      let query = UserService.knex
        .select('users.*', 'positions.name as position_name')
        .from('users')
        .join('positions', 'users.position_id', 'positions.id');

      if (offset) {
        query = query.offset(Number(offset));
      }

      if (count) {
        query = query.limit(Number(count));
      }

      if (page) {
        const pageSize = count ? Number(count) : this.defaultCount;
        const currentPage = Number(page);

        query = query.offset((currentPage - 1) * pageSize).limit(pageSize);
      }

      const users = await query;
      if (users.length == 0) {
        throw new HttpException('Users not found', 404);
      }

      const response: any = { success: true, total_users: Number(total) }

      if (page) {
        response.page = Number(page);
        response.total_pages = total_pages;
        if (!count) {
          response.count = this.defaultCount;
        }
        response.links = {
          "next_url": Number(page) + 1 > total_pages ? null : `${process.env.API_URL}/users?page=${Number(page) + 1}&count=${count ? count : this.defaultCount}`,
          "prev_url": Number(page) - 1 == 0 ? null : `${process.env.API_URL}/users?page=${Number(page) - 1}&count=${count ? count : this.defaultCount}`
        }
      }

      if (offset) {
        response.offset = Number(offset);
      }

      if (count) {
        response.count = Number(count);
      }

      response.users = users;
      return response;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      } else {
        throw new HttpException();
      }
    }
  }
}

const userService = UserService.getInstance()

export default userService;