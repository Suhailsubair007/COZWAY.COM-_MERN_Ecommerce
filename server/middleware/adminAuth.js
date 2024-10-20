const jwt = require("jsonwebtoken");
const Admin = require('../model/Admin');

const verifyAdmin = async (req, res, next) => {
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    

    if (accessToken) {
        const decode = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
            if (err) {
                if (err.name === "TokenExpiredError") {
                    handleRefreshToken(refreshToken, req, res, next);
                } else {
                    res.status(401).json({ message: "User not authorized, token verification failed" });
                }
            } else {
                req.admin = decoded.admin;
                next();
            }
        });
    } else {
        handleRefreshToken(refreshToken, req, res, next);
    }
};


//Helper function for chek refresh token and create a new asses token with refresh token

const handleRefreshToken = async (refreshToken, req, res, next) => {
    if (refreshToken) {
        try {
            const decodeRefresh = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
            const newAccessToken = jwt.sign({ admin: decodeRefresh.admin }, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: "2m",
            });

            res.cookie("accessToken", newAccessToken, {
                httpOnly: true,
                secure: false,
                sameSite: "strict",
                maxAge: 2 * 60 * 1000,
            });

            const admin = await Admin.findById(decodeRefresh.admin).select("-password");
            req.admin = admin;
            next();
        } catch (err) {
            res.status(403).json({ message: "Refresh token is invalid or expired" });
        }
    } else {
        res.status(401).json({ message: "No access token and no refresh token provided" });
    }
};

module.exports = verifyAdmin;
