const jwt = require("jsonwebtoken");
const User = require('../model/User');

const verifyUser = async (req, res, next) => {
    const accessToken = req.cookies.userAccessTocken;
    const refreshToken = req.cookies.userRefreshTocken;



    if (accessToken) {
        const decode = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {

            if (err) {
                if (err.name === "TokenExpiredError") {
                    handleRefreshToken(refreshToken, req, res, next);
                } else {
                    res.status(401).json({ message: "User not authorized, token verification failed" });
                }
            } else {
                req.user = decoded.user;
                next();
            }

        });
        // console.log("decodedddd",decode)
    } else {
        handleRefreshToken(refreshToken, req, res, next);
    }
};


//Helper function for chek refresh token and create a new asses token with refresh token

const handleRefreshToken = async (refreshToken, req, res, next) => {
    if (refreshToken) {
        try {
            const decodeRefresh = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            const newAccessToken = jwt.sign({ user: decodeRefresh.user }, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: "2m",
            });

            res.cookie("userAccessTocken", newAccessToken, {
                httpOnly: true,                                                                          
                secure: false,
                sameSite: "strict",
                maxAge: 2 * 60 * 1000,
            });

            const user = await User.findById(decodeRefresh.user).select("-password");
            req.user = user;
            next();
        } catch (err) {
            res.status(403).json({ message: "Refresh token is invalid or expired" });
        }
    } else {
        res.status(401).json({ message: "No access token and no refresh token provided" });
    }
};

module.exports = verifyUser;
