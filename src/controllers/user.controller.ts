import { NextFunction, Request, Response } from "express";
import multer from "multer";
import * as fs from 'fs';
import UserService from '../services/user.service';
import { CreateUserDto, GetUserQueryParams } from "../types/user.type";
import { RequestWithFailsPhoto } from "../types/request.type";
import HttpException from "../exceptions/http.exception";
import { usedTokens } from "../server";
import { FileDto } from "../types/file.type";

class UserController {
  private static instance: UserController;
  constructor() { }

  public static getInstance(): UserController {
    if (!UserController.instance) {
      UserController.instance = new UserController();
    }
    return UserController.instance;
  }

  public async getUsers(req: Request, res: Response, next: NextFunction) {
    const { page, offset, count }: GetUserQueryParams = req.query;
    UserService.getUsers({ page, offset, count })
      .then((response) => {
        res.status(200).json(response);
      })
      .catch((error) => {
        next(error);
      })
  } // getUsers

  public async getUserById(req: Request, res: Response, next: NextFunction) {
    const id: number | undefined = Number(req.params['id']);
    if (isNaN(id)) {
      next(new HttpException('Validation failed', 400, { user_id: ['The user_id must be an integer.'] }))
    } else {
      UserService.getUserById(id)
        .then((response) => {
          res.status(200).json(response);
        })
        .catch((error) => {
          next(error);
        })
    }
  } // getUsers

  public async createUser(req: Request, res: Response, next: NextFunction) {
    const uploadPhoto = multer().single('photo');
    uploadPhoto(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        console.log(err);
        throw new HttpException('File upload error', 400)
      } else if (err) {
        console.log(err);
        throw new HttpException()
      }

      const { name, email, phone, position_id }: CreateUserDto = req.body;

      // Access the uploaded file details from req.file
      const photoFile: FileDto = req.file!;
      
      UserService.createUser({ name, email, phone, position_id, photoFile: photoFile })
        .then((response: any) => {
          res.status(201).json({
            success: true,
            user_id: response.id,
            message: "New user successfully registered"
          })
        })
        .catch((error) => {
          if (error instanceof HttpException) {
            next(error);
          } else {
            next(new HttpException())
          }
        })
    }); // upload
  } // registerUser

  public async getPositions(req: Request, res: Response, next: NextFunction) {
    UserService.getPositions()
      .then((response) => {
        res.status(200).json(response);
      })
      .catch((error) => {
        next(error);
      })
  } // getPositions
}

const userController = UserController.getInstance()

export default userController;