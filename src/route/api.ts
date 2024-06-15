import {Router} from "express";
import {authMiddleware} from "../middleware/auth-middleware";
import {UserController} from "../controller/user-controller";

export const apiRouter = Router();
apiRouter.use(authMiddleware);

apiRouter.get("/api/users/current", UserController.get);
