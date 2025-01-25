import dotenv from "dotenv";
dotenv.config();

const env = {
    port: process.env.PORT,
    secretSession: process.env.SECRET_SESSION,
    adminCode: process.env.PASSWORD_CREATE_NEW_ADMIN,
    origin: {
        admin: process.env.ORIGIN_ADMIN,
        users: process.env.ORIGIN_USERS,
    },
};

export { env };
