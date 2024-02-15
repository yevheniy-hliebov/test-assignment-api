import {Knex as iKnex} from "knex";
import { UserType } from "../types/user.type";

const tableName = 'users';

export class UserService {
  constructor (private knex: iKnex) {}

  async getAllUsers(): Promise<UserType[]> {
    return this.knex.select('*').from(tableName);
  }
}