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
    validation: {
        users: {
            username: {
                minLength: process.env.USERNAME_MIN_LENGTH,
                maxLength: process.env.USERNAME_MAX_LENGTH,
                // It must start with a letter
                regex: process.env.USERNAME_REGEX,
                message: process.env.USERNAME_REGEX_MESSAGE,
            },
            password: {
                minLength: process.env.PASSWORD_MIN_LENGTH,
                maxLength: process.env.PASSWORD_MAX_LENGTH,
                // At least one letter, one number and one special character
                regex: process.env.PASSWORD_REGEX,
                message: process.env.PASSWORD_REGEX_MESSAGE,
            },
        },
    },
};

export { env };
