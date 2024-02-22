import path from 'path';
import * as fs from 'fs';
import Knex, { Knex as iKnex } from "knex";
import configConnection from '../configs/db.config';
import HttpException from "../exceptions/http.exception";
import { validateGetUserQueryParams } from "../validations/query.validation";
import { CreateUserDto, GetUserQueryParams } from "../types/user.type";
import validationCreateUser from "../validations/create-user.validation";
import { imageOptimization, saveAsJPG } from '../utils/image-compration.util';
import imageConfig from '../configs/image.config';

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
        .join('positions', 'users.position_id', 'positions.id')
        .orderBy('users.id', 'desc');

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
  } // getUsers

  public async getUserById(id: number) {
    try {
      const user = await UserService.knex.select('*').from('users').where('id', id);
      if (user.length > 0) {
        const response = {
          success: true,
          user: user[0]
        };
        return response;
      } else {
        throw new HttpException('The user with the requested identifier does not exist', 404, { user_id: ['User not found'] })
      }
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      } else {
        throw new HttpException();
      }
    }
  } // getUserById

  public async createUser(createUserDto: CreateUserDto) {
    const fails = validationCreateUser(createUserDto);
    if (fails) {
      throw new HttpException('Validation failed', 422, fails)
    } else {
      try {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const extension = path.extname(createUserDto.photoFile.originalname);
        const filename = uniqueSuffix + extension;

        const photoPath = `${imageConfig.start_url}/api/v1/images/users/${filename}`
        const user = (await UserService.knex('users').returning('*').insert({
          name: createUserDto.name,
          email: createUserDto.email,
          phone: createUserDto.phone.replace(/[\s\-]/g, ''),
          position_id: Number(createUserDto.position_id),
          registration_timestamp: Date.now(),
          photo: photoPath,
        }))[0];
        
        const destination = 'storage/images/users/';
        if (!fs.existsSync(destination)) {
          fs.mkdirSync(destination, { recursive: true });
        }
        const optBufferPhoto = await imageOptimization(createUserDto.photoFile.buffer);
        saveAsJPG(optBufferPhoto, filename);
        
        return user;
      } catch (error: any) {
        console.log(error);
        
        if (error.code == '23505' && (error.constraint == 'users_email_unique' || error.constraint == 'users_phone_unique')) {
          throw new HttpException('User with this phone or email already exist', 409)
        } else {
          throw new HttpException()
        }
      }
    }
  } // createUser

  public async getPositions() {
    try {
      const positions = await UserService.knex.select('*').from('positions');
      const response = {
        success: true,
        positions
      };
      return response;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error
      } else {
        throw new HttpException();
      }
    }
  } // getPositions
}

const userService = UserService.getInstance()

export default userService;