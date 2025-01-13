import dotenv from "dotenv";
dotenv.config();

const env = {
    port: process.env.PORT,
    secretSession: process.env.SECRET_SESSION,
};

export { env };
