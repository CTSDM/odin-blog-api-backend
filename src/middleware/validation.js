import { body, query, param, validationResult } from "express-validator";
import { env } from "../../config/config.js";
import db from "../db/queries.js";

function checkErrors(req, res, next) {
    const errors = validationResult(req);
    const errMsgArray = [];
    if (res.locals.msg) {
        errMsgArray.push(res.locals.msg);
    }
    if (!errors.isEmpty()) {
        errors.array().map((err) => errMsgArray.push(err.msg));
        res.status(400).json({ errMsg: errMsgArray });
    } else {
        next();
    }
}

function checkLength(id, type, min, max) {
    return id
        .isLength({ min: min, max: max })
        .withMessage(`The ${type} should be between ${min} and ${max} characters.`);
}

function checkWhiteSpaces(id, type) {
    return id
        .custom((value) => !/\s/.test(value))
        .withMessage(`The ${type} cannot contain white spaces.`);
}

function checkPasswordMatch(id) {
    return id
        .custom((value, { req }) => value === req.body.rePassword)
        .withMessage("Passwords do not match.");
}

function checkRegex(id, regex, message) {
    return id
        .custom((value) => {
            const reg = new RegExp(String.raw`${regex}`);
            return reg.test(value);
        })
        .withMessage(message);
}

function checkAlphaNumerical(id, type) {
    return id
        .isAlphanumeric()
        .withMessage(`The ${type} can only be composed of letters and numbers.`);
}

function checkUsernameExists(id) {
    return id
        .custom(async (value) => {
            const username = value;
            const userDB = await db.getUser("username", username);
            if (userDB) {
                // we need to return a promise because we are using an async function!
                return Promise.reject();
            }
            return Promise.resolve();
        })
        .withMessage("The username is already in use, please select another username.");
}

function checkNotEmpty(id, type) {
    return id.trim().notEmpty().withMessage(`The ${type} cannot be empty`);
}

function checkBoolean(id, type) {
    return id.isBoolean().withMessage(`The ${type} should be a boolean`);
}

const signup = [
    checkUsernameExists(body("username")),
    checkAlphaNumerical(body("username"), "username"),
    checkLength(
        body("username"),
        "username",
        env.validation.users.username.minLength,
        env.validation.users.username.maxLength,
    ),
    checkWhiteSpaces(body("username"), "username"),
    checkRegex(
        body("username"),
        env.validation.users.username.regex,
        env.validation.users.username.message,
    ),
    checkLength(
        body("password"),
        "password",
        env.validation.users.password.minLength,
        env.validation.users.password.maxLength,
    ),
    checkRegex(
        body("password"),
        env.validation.users.password.regex,
        env.validation.users.password.message,
    ),
    checkPasswordMatch(body("password")),
];

const login = [
    checkNotEmpty(body("username"), "username"),
    checkNotEmpty(body("password"), "password"),
];

const dataPost = [
    checkNotEmpty(body("title"), "title"),
    checkNotEmpty(body("content"), "content"),
    checkBoolean(body("visible"), "visible variable"),
];

const getPost = [param("id").trim().isNumeric().withMessage("The post id must be a number")];
const getComment = [body("id").trim().isNumeric().withMessage("The post id must be a number")];

const validation = { signup, login, dataPost, getPost, getComment, checkErrors };
export default validation;
