import express from "express";
import session from "express-session";
import passport from "passport";
import cors from "cors";

import { env } from "../config/config.js";
import sessionOptions from "../config/session.js";
import routePosts from "./routes/post.js";
import routeSignup from "./routes/signup.js";
import routeLogin from "./routes/login.js";
import routeLogout from "./routes/logout.js";
import routeComments from "./routes/comments.js";

import "../config/passport.js";

const app = express();

app.use(session(sessionOptions));
// enable all cors
app.use(
    cors({
        exposedHeaders: ["SET-COOKIES"],
        credentials: true,
        origin: ["http://localhost:5173", "http://localhost:5174"],
    }),
);
// for now we will use sesssion
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/signup", routeSignup);
app.use("/login", routeLogin);
app.use("/logout", routeLogout);
app.use("/posts", routePosts);
app.use("/comments", routeComments);
app.use((_, res) => res.sendStatus(404));

app.listen(env.port, () => console.log(`Listening on port ${env.port}`));
