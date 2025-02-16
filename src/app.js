import express from "express";
import passport from "passport";
import cors from "cors";
import cookieParser from "cookie-parser";

import { env } from "../config/config.js";
import routePosts from "./routes/post.js";
import routeSignup from "./routes/signup.js";
import routeLogin from "./routes/login.js";
import routeLogout from "./routes/logout.js";
import routeComments from "./routes/comments.js";

import "../config/passport.js";

const app = express();

app.use(cookieParser());
// enable all cors
app.use(
    cors({
        exposedHeaders: ["SET-COOKIES"],
        credentials: true,
        origin: (origin, cb) => {
            const allowedOrigins = process.env.ALLOWED_ORIGINS.split(" ");
            if (allowedOrigins.indexOf(origin) !== -1) {
                cb(null, true);
            } else {
                cb(new Error(`Request from unauthorized origin ${origin}`));
            }
        },
    }),
);

app.use(passport.initialize());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/signup", routeSignup);
app.use("/login", routeLogin);
app.use("/logout", routeLogout);
app.use("/posts", routePosts);
app.use("/comments", routeComments);
app.use((_, res) => res.status(200).json({ msg: "hello there :)" }));

app.listen(env.port, () => console.log(`Listening on port ${env.port}`));
