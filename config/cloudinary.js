import { env } from "../config/config.js";
import { v2 as cloudinary } from "cloudinary";

// using cloudinary to pull up the files
cloudinary.config({
    cloud_name: env.cloudinary.cloud_name,
    api_key: env.cloudinary.api_key,
    api_secret: env.cloudinary.api_secret,
});

export default cloudinary;
