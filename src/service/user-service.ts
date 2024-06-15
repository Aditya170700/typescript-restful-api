import {CreateUserRequest, toUserResponse, UserResponse} from "../model/user-model";
import {Validation} from "../validation/validation";
import {UserValidation} from "../validation/user-validation";
import {prismaClient} from "../application/database";
import {ResponseError} from "../../error/response-error";
import bcrypt from 'bcrypt';

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
}