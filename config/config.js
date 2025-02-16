import dotenv from "dotenv";
dotenv.config();

const env = {
    port: process.env.PORT,
    secretSession: process.env.SECRET_SESSION,
    keyAccessToken: process.env.SECRET_ACCESS_TOKEN,
    keyRefreshToken: process.env.SECRET_REFRESH_TOKEN,
    adminCode: process.env.PASSWORD_CREATE_NEW_ADMIN,
    whitelist: process.env.ALLOWED_ORIGINS,
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
    cookieOptions: { httpOnly: true, secure: false },
    dbMessages: {
        delete: {
            notFound: "Record to delete does not exist.",
        },
    },
    cloudinary: {
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.API_KEY_CLOUDINARY,
        api_secret: process.env.API_SECRET_CLOUDINARY,
        folder: process.env.CLOUDINARY_FOLDER,
    },
    profiles: {
        backup: process.env.BACKUP_PROFILE,
        admin: process.env.ADMIN_PROFILE,
    },
};

export { env };
