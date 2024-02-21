import { NextFunction, Request, Response } from "express";
import UserService from '../services/user.service';
import { GetUserQueryParams } from "../types/user.type";

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
  }
}

const userController = UserController.getInstance()

export default userController;