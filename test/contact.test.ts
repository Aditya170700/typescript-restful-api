import {ContactTest, UserTest} from "./test-util";
import supertest from "supertest";
import {web} from "../src/application/web";
import {logger} from "../src/application/logging";
import {toContactResponse} from "../src/model/contact-model";

describe('POST /api/contacts', () => {
    beforeEach(async () => {
        await UserTest.create();
    });

    afterEach(async () => {
        await ContactTest.deleteAll();
        await UserTest.delete();
    });

    it('Should create new contact', async () => {
        const response = await supertest(web)
            .post("/api/contacts")
            .set("X-API-TOKEN", "test")
            .send({
                first_name: "Aditya",
                last_name: "Ricki",
                email: "test@example.com",
                phone: "1234567890"
            });

        logger.debug(response.body);
        expect(response.status).toBe(201);
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.first_name).toBe("Aditya");
        expect(response.body.data.last_name).toBe("Ricki");
        expect(response.body.data.email).toBe("test@example.com");
        expect(response.body.data.phone).toBe("1234567890");
    });

    it('Should reject create new contact id request invalid', async () => {
        const response = await supertest(web)
            .post("/api/contacts")
            .set("X-API-TOKEN", "test")
            .send({
                first_name: "",
                last_name: "",
                email: "test",
                phone: "1234567890291867981279872981"
            });

        logger.debug(response.body);
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });
});

describe('GET /api/contacts/:contactId', () => {
    beforeEach(async () => {
        await UserTest.create();
        await ContactTest.create();
    });

    afterEach(async () => {
        await ContactTest.deleteAll();
        await UserTest.delete();
    });

    it('Should be able get contact', async () => {
        const contact = await ContactTest.get();
        const response = await supertest(web)
            .get(`/api/contacts/${contact.id}`)
            .set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.first_name).toBe(contact.first_name);
        expect(response.body.data.last_name).toBe(contact.last_name);
        expect(response.body.data.email).toBe(contact.email);
        expect(response.body.data.phone).toBe(contact.phone);
    });

    it('Should reject get contact if contact not found', async () => {
        const contact = await ContactTest.get();
        const response = await supertest(web)
            .get(`/api/contacts/${contact.id + 1}`)
            .set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();
    });
});

describe('PUT /api/contacts/:contactId', () => {
    beforeEach(async () => {
        await UserTest.create();
        await ContactTest.create();
    });

    afterEach(async () => {
        await ContactTest.deleteAll();
        await UserTest.delete();
    });

    it('Should be able update contact', async () => {
        const contact = await ContactTest.get();
        const response = await supertest(web)
            .put(`/api/contacts/${contact.id}`)
            .set("X-API-TOKEN", "test")
            .send({
                first_name: "updated",
                last_name: "updated",
                email: "updated@example.com",
                phone: "1234567890"
            });

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.id).toBeDefined();
        expect(response.body.data.first_name).toBe("updated");
        expect(response.body.data.last_name).toBe("updated");
        expect(response.body.data.email).toBe("updated@example.com");
        expect(response.body.data.phone).toBe("1234567890");
    });

    it('Should reject update contact if request is invalid', async () => {
        const contact = await ContactTest.get();
        const response = await supertest(web)
            .put(`/api/contacts/${contact.id}`)
            .set("X-API-TOKEN", "test")
            .send({
                first_name: "",
                last_name: "",
                email: "",
                phone: ""
            });

        logger.debug(response.body);
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });
});

describe('DELETE /api/contacts/:contactId', () => {
    beforeEach(async () => {
        await UserTest.create();
        await ContactTest.create();
    });

    afterEach(async () => {
        await ContactTest.deleteAll();
        await UserTest.delete();
    });

    it('Should be able delete contact', async () => {
        const contact = await ContactTest.get();
        const response = await supertest(web)
            .delete(`/api/contacts/${contact.id}`)
            .set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data).toBe(true);
    });

    it('Should reject delete contact if contact not found', async () => {
        const contact = await ContactTest.get();
        const response = await supertest(web)
            .delete(`/api/contacts/${contact.id + 1}`)
            .set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.status).toBe(404);
        expect(response.body.errors).toBeDefined();
    });
});

describe('GET /api/contacts', () => {
    beforeEach(async () => {
        await UserTest.create();
        await ContactTest.create();
    });

    afterEach(async () => {
        await ContactTest.deleteAll();
        await UserTest.delete();
    });

    it('Should be able search contact', async () => {
        const response = await supertest(web)
            .get(`/api/contacts`)
            .set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(1);
        expect(response.body.paging.current_page).toBe(1);
        expect(response.body.paging.size).toBe(10);
        expect(response.body.paging.total_page).toBe(1);
    });

    it('Should be able search contact using name', async () => {
        const response = await supertest(web)
            .get(`/api/contacts`)
            .query({
                name: "est",
            })
            .set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(1);
        expect(response.body.paging.current_page).toBe(1);
        expect(response.body.paging.size).toBe(10);
        expect(response.body.paging.total_page).toBe(1);
    });

    it('Should be able search contact using email', async () => {
        const response = await supertest(web)
            .get(`/api/contacts`)
            .query({
                email: "@",
            })
            .set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(1);
        expect(response.body.paging.current_page).toBe(1);
        expect(response.body.paging.size).toBe(10);
        expect(response.body.paging.total_page).toBe(1);
    });

    it('Should be able search contact using phone', async () => {
        const response = await supertest(web)
            .get(`/api/contacts`)
            .query({
                phone: "0000",
            })
            .set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(1);
        expect(response.body.paging.current_page).toBe(1);
        expect(response.body.paging.size).toBe(10);
        expect(response.body.paging.total_page).toBe(1);
    });

    it('Should be able search contact using name no result', async () => {
        const response = await supertest(web)
            .get(`/api/contacts`)
            .query({
                name: "salah",
            })
            .set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(0);
        expect(response.body.paging.current_page).toBe(1);
        expect(response.body.paging.size).toBe(10);
        expect(response.body.paging.total_page).toBe(0);
    });

    it('Should be able search contact using email no result', async () => {
        const response = await supertest(web)
            .get(`/api/contacts`)
            .query({
                email: "@gmail.com",
            })
            .set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(0);
        expect(response.body.paging.current_page).toBe(1);
        expect(response.body.paging.size).toBe(10);
        expect(response.body.paging.total_page).toBe(0);
    });

    it('Should be able search contact using phone no result', async () => {
        const response = await supertest(web)
            .get(`/api/contacts`)
            .query({
                phone: "11111",
            })
            .set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(0);
        expect(response.body.paging.current_page).toBe(1);
        expect(response.body.paging.size).toBe(10);
        expect(response.body.paging.total_page).toBe(0);
    });

    it('Should be able search contact with paging', async () => {
        const response = await supertest(web)
            .get(`/api/contacts`)
            .query({
                page: 2,
                size: 1,
            })
            .set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.length).toBe(0);
        expect(response.body.paging.current_page).toBe(2);
        expect(response.body.paging.size).toBe(1);
        expect(response.body.paging.total_page).toBe(1);
    });
});
