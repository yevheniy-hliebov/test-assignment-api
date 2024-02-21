import express, { Request, Response } from "express";
import userController from "../controllers/user.controller";
const router = express.Router();

router.get("/", userController.getUsers);

export default router;