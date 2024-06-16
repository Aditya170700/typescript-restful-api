import {Address, User} from "@prisma/client";
import {AddressResponse, CreateAddressRequest, GetAddressRequest, toAddressResponse} from "../model/address-model";
import {Validation} from "../validation/validation";
import {AddressValidation} from "../validation/address-validation";
import {ContactService} from "./contact-service";
import {prismaClient} from "../application/database";
import {ResponseError} from "../../error/response-error";

export class AddressService {
    static async create(user: User, request: CreateAddressRequest): Promise<AddressResponse> {
        const data = Validation.validate(AddressValidation.CREATE, request);
        await ContactService.checkContactMustExists(user.username, request.contact_id);

        const address = await prismaClient.address.create({
            data: data
        });

        return toAddressResponse(address as Address);
    }

    static async get(user: User, request: GetAddressRequest): Promise<AddressResponse> {
        const data = Validation.validate(AddressValidation.GET, request);
        await ContactService.checkContactMustExists(user.username, request.contact_id);

        const address = await prismaClient.address.findFirst({
            where: {
                id: data.id,
                contact_id: data.contact_id,
            }
        });

        if (!address) throw new ResponseError(404, "Address not found");

        return toAddressResponse(address as Address);
    }
}