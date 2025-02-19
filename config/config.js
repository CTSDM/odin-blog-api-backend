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
                regex: process.env.USERNAME_REGEX,
                message: process.env.USERNAME_REGEX_MESSAGE,
            },
            password: {
                minLength: process.env.PASSWORD_MIN_LENGTH,
                maxLength: process.env.PASSWORD_MAX_LENGTH,
                regex: process.env.PASSWORD_REGEX,
                message: process.env.PASSWORD_REGEX_MESSAGE,
            },
        },
    },
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
    allowedOrigins: process.env.ALLOWED_ORIGINS,
    delimiter: process.env.DELIMITER,
    devStatus: process.env.DEV_STATUS === "1" ? true : false,
};

// 190 days for the cookie to expire
env.cookie = {
    options: {
        httpOnly: true,
        secure: env.devStatus ? false : true,
        sameSite: "none",
    },
    maxAge: 1000 * 60 * 60 * 24 * 190,
};

const corsConfig = {
    exposedHeaders: ["SET-COOKIES"],
    credentials: true,
    origin: (origin, cb) => {
        const allowedOrigins = env.allowedOrigins.split(" ");
        if (allowedOrigins.indexOf(origin) !== -1) {
            cb(null, true);
        } else {
            cb(new Error(`Request from unauthorized origin ${origin}`));
        }
    },
};

export { env, corsConfig };
