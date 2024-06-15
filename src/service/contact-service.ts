import {ContactResponse, CreateContactRequest, toContactResponse} from "../model/contact-model";
import {Validation} from "../validation/validation";
import {ContactValidation} from "../validation/contact-validation";
import {Contact, User} from "@prisma/client";
import {prismaClient} from "../application/database";

export class ContactService {
    static async create(user: User, req: CreateContactRequest): Promise<ContactResponse> {
        const data = Validation.validate(ContactValidation.CREATE, req);
        const record = {
            ...data,
            ...{username: user.username},
        }

        const contact = await prismaClient.contact.create({
            data: record,
        });

        return toContactResponse(contact as Contact);
    }
}