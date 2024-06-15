import {CreateUserRequest, LoginUserRequest, toUserResponse, UserResponse} from "../model/user-model";
import {Validation} from "../validation/validation";
import {UserValidation} from "../validation/user-validation";
import {prismaClient} from "../application/database";
import {ResponseError} from "../../error/response-error";
import bcrypt from 'bcrypt';
import {v4 as uuid} from "uuid";

export class UserService {
    static async register(request: CreateUserRequest): Promise<UserResponse> {
        const data = Validation.validate(UserValidation.REGISTER, request);

        const isExists = (await prismaClient.user.count({
            where: {
                username: request.username,
            }
        })) > 0;

        if (isExists) throw new ResponseError(400, "Username already exists");

        data.password = await bcrypt.hash(data.password, 10);

        const user = await prismaClient.user.create({
            data: data
        });

        return toUserResponse(user);
    }

    static async login(request: LoginUserRequest): Promise<UserResponse> {
        const data = Validation.validate(UserValidation.LOGIN, request);

        let user = await prismaClient.user.findUnique({
            where: {
                username: request.username,
            }
        });

        if (!user) throw new ResponseError(401, "Incorrect username or password");

        const isPasswordValid = await bcrypt.compare(data.password, user.password);

        if (!isPasswordValid) throw new ResponseError(401, "Incorrect username or password");

        user = await prismaClient.user.update({
            where: {
                username: request.username,
            },
            data: {
                token: uuid()
            }
        });

        const response = toUserResponse(user);
        response.token = user.token!;
        return response;
    }
}