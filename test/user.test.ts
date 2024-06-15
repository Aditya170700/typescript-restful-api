import supertest from "supertest";
import {web} from "../src/application/web";
import {logger} from "../src/application/logging";
import {UserTest} from "./test-util";
import bcrypt from "bcrypt";

describe('POST /api/users', () => {
    afterEach(async () => {
        await UserTest.delete();
    });

    it('Should reject register new user if request is invalid', async () => {
        const response = await supertest(web)
            .post("/api/users")
            .send({
                username: "",
                password: "",
                name: ""
            });

        logger.debug(response.body);
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });

    it('Should register new user if request is valid', async () => {
        const response = await supertest(web)
            .post("/api/users")
            .send({
                username: "test",
                password: "test",
                name: "test"
            });

        logger.debug(response.body);
        expect(response.status).toBe(201);
        expect(response.body.data.username).toBe("test");
        expect(response.body.data.name).toBe("test");
    });
});

describe('POST /api/users/login', () => {
    beforeEach(async () => {
        await UserTest.create();
    });

    afterEach(async () => {
        await UserTest.delete();
    });

    it('Should be able to login', async () => {
        const response = await supertest(web)
            .post("/api/users/login")
            .send({
                username: "test",
                password: "test",
            });

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.username).toBe("test");
        expect(response.body.data.name).toBe("test");
        expect(response.body.data.token).toBeDefined();
    });

    it('Should reject login if username is invalid', async () => {
        const response = await supertest(web)
            .post("/api/users/login")
            .send({
                username: "salah",
                password: "test",
            });

        logger.debug(response.body);
        expect(response.status).toBe(401);
        expect(response.body.errors).toBeDefined();
    });

    it('Should reject login if password is invalid', async () => {
        const response = await supertest(web)
            .post("/api/users/login")
            .send({
                username: "test",
                password: "salah",
            });

        logger.debug(response.body);
        expect(response.status).toBe(401);
        expect(response.body.errors).toBeDefined();
    });
});

describe('GET /api/users/current', () => {
    beforeEach(async () => {
        await UserTest.create();
    });

    afterEach(async () => {
        await UserTest.delete();
    });

    it('Should be able to get user', async () => {
        const response = await supertest(web)
            .get(`/api/users/current`)
            .set("X-API-TOKEN", "test");

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.username).toBe("test");
        expect(response.body.data.name).toBe("test");
    });

    it('Should reject get user if token is invalid', async () => {
        const response = await supertest(web)
            .get(`/api/users/current`)
            .set("X-API-TOKEN", "salah");

        logger.debug(response.body);
        expect(response.status).toBe(401);
        expect(response.body.errors).toBeDefined();
    });
});

describe('PATCH /api/users/current', () => {
    beforeEach(async () => {
        await UserTest.create();
    });

    afterEach(async () => {
        await UserTest.delete();
    });

    it('Should be able to update user name', async () => {
        const response = await supertest(web)
            .patch("/api/users/current")
            .set("X-API-TOKEN", "test")
            .send({
                name: "test guys",
            });

        logger.debug(response.body);
        expect(response.status).toBe(200);
        expect(response.body.data.username).toBe("test");
        expect(response.body.data.name).toBe("test guys");
    });

    it('Should be able to update user password', async () => {
        const response = await supertest(web)
            .patch("/api/users/current")
            .set("X-API-TOKEN", "test")
            .send({
                password: "test guys",
            });

        logger.debug(response.body);
        expect(response.status).toBe(200);

        const user = await UserTest.get();

        expect(await bcrypt.compare("test guys", user.password)).toBe(true);
    });

    it('Should reject update user if request is invalid', async () => {
        const response = await supertest(web)
            .patch("/api/users/current")
            .set("X-API-TOKEN", "test")
            .send({
                name: "",
                password: "",
            });

        logger.debug(response.body);
        expect(response.status).toBe(400);
        expect(response.body.errors).toBeDefined();
    });

    it('Should reject update user if token is invalid', async () => {
        const response = await supertest(web)
            .patch("/api/users/current")
            .set("X-API-TOKEN", "salah")
            .send({
                name: "wkwk",
                password: "wkwk",
            });

        logger.debug(response.body);
        expect(response.status).toBe(401);
        expect(response.body.errors).toBeDefined();
    });
});
