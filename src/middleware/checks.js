function loggedIn(req, res, next) {
    if (req.user) {
        next();
    } else return res.status(401).json({ msg: "User not logged in" });
}

export default { loggedIn };
