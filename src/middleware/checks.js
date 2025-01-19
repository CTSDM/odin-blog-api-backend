function isLoggedIn(req, res, next) {
    if (req.user) {
        next();
    } else return res.status(401).json({ msg: "User not logged in" });
}

function isAdmin(req, res, next) {
    if (req.user["is_admin"]) {
        next();
    } else {
        return res.sendStatus(401);
    }
}

export default { isLoggedIn, isAdmin };
