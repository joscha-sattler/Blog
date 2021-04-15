const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
    const token = req.headers.authorization.split(" ")[1];  //gibt das Token
    const decodedToken = jwt.verify(token, "einGeheimnisZuHabenIstImmerGut-HierIstMeinGeheimnis");
    req.userData = {username: decodedToken.username, userId: decodedToken.userId}; // Userdaten holen, um später Posts mit User-ID auszustatten
    next();
    } catch(error) {
        res.status(401).json({
            message: "Du bist nicht authentifiziert!"
        });
    }
}
