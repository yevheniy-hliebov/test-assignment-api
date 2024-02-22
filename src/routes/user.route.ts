import express from "express";
import UserController from "../controllers/user.controller";
import checkTokenMiddleware from "../middlewares/check-token.middleware";
const router = express.Router();

router.get("/users", UserController.getUsers);
router.post("/users", checkTokenMiddleware, UserController.createUser);
router.get("/users/:id", UserController.getUserById);
router.get("/positions", UserController.getPositions);

export default router;