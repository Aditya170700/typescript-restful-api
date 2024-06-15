import {User} from "@prisma/client";

export type UserResponse = {
    username: string;
    name: string;
    token?: string;
}

export type CreateUserRequest = {
    username: string;
    name: string;
    password: string;
}

export function toUserResponse(user: Prisma.Prisma__UserClient<GetResult<Prisma.$UserPayload<DefaultArgs>, {
    data: CreateUserRequest
}, "create">, never, DefaultArgs>): UserResponse {
    return {
        name: user.name,
        username: user.username,
    }
}
