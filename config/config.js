import dotenv from "dotenv";
dotenv.config();

const env = {
    port: process.env.PORT,
    secretSession: process.env.SECRET_SESSION,
    adminCode: process.env.PASSWORD_CREATE_NEW_ADMIN,
};

export { env };
