import {prismaClient} from "../src/application/database";
import bcrypt from "bcrypt";
import {Address, Contact, User} from "@prisma/client";
import {ResponseError} from "../src/error/response-error";

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

    static async create() {
        await prismaClient.contact.create({
            data: {
                first_name: "test",
                last_name: "test",
                email: ("test@example.com"),
                phone: "0000000000",
                username: "test"
            }
        });
    }

    static async get(): Promise<Contact> {
        const contact = await prismaClient.contact.findFirst({
            where: {
                username: "test"
            }
        });

        if (!contact) throw new Error("Could not find contact");

        return contact as Contact;
    }
}

export class AddressTest {
    static async deleteAll() {
        await prismaClient.address.deleteMany({
            where: {
                contact: {
                    username: "test"
                }
            }
        });
    }

    static async create() {
        const contact = await ContactTest.get();

        await prismaClient.address.create({
            data: {
                contact_id: contact.id,
                street: "test",
                city: "test",
                province: "test",
                country: "test",
                postal_code: "test"
            }
        });
    }

    static async get(): Promise<Address> {
        const address = await prismaClient.address.findFirst({
            where: {
                contact: {
                    username: "test"
                }
            }
        });

        if (!address) throw new Error("Could not find address");

        return address as Address;
    }
}
