import {prismaClient} from "../src/application/database";
import bcrypt from "bcrypt";
import {User} from "@prisma/client";
import {ResponseError} from "../error/response-error";

export class UserTest {
    static async delete() {
        const where = {
            username: "test"
        };

        await prismaClient.user.deleteMany({where});
    }

    static async create() {
        await prismaClient.user.create({
            data: {
                username: "test",
                name: "test",
                password: await bcrypt.hash("test", 10),
                token: "test"
            }
        });
    }

    static async get(): Promise<User> {
        const user = await prismaClient.user.findFirst({
            where: {
                username: "test",
            }
        });

        if (!user) throw new ResponseError(400, "User not found");

        return user;
    }
}

export class ContactTest {
    static async deleteAll() {
        await prismaClient.contact
            .deleteMany({
            where: {
                username: "test",
            }
        });
    }
}
