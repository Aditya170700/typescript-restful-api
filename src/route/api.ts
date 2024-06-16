import {Router} from "express";
import {authMiddleware} from "../middleware/auth-middleware";
import {UserController} from "../controller/user-controller";
import {ContactController} from "../controller/contact-controller";

export const apiRouter = Router();
apiRouter.use(authMiddleware);

apiRouter.get("/api/users/current", UserController.get);
apiRouter.patch("/api/users/current", UserController.update);
apiRouter.delete("/api/users/current", UserController.logout);

apiRouter.post("/api/contacts", ContactController.create);
apiRouter.get("/api/contacts/:contactId(\\d+)", ContactController.get);
apiRouter.put("/api/contacts/:contactId(\\d+)", ContactController.update);
