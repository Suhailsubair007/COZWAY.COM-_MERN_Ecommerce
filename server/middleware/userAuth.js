const jwt = require("jsonwebtoken");
const User = require("../model/User");

const verifyUser = async (req, res, next) => {
    const accessToken = req.cookies.jwt;
    const refreshToken = req.cookies.refreshToken;

    if (accessToken) {
        try {
            const decode = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
            const user = await User.findById(decode.user).select("-password");
            req.user = user; // Attaching user to the request object for later use
            next();
        } catch (err) {
            if (err.name === "TokenExpiredError") {
                // If the access token has expired, check the refresh token
                if (refreshToken) {
                    try {
                        const decodeRefresh = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

                        // Generate a new access token
                        const newAccessToken = jwt.sign({ user: decodeRefresh.user }, process.env.ACCESS_TOKEN_SECRET, {
                            expiresIn: "30d",
                        });

                        // Set the new access token in the cookie
                        res.cookie("jwt", newAccessToken, {
                            httpOnly: true,
                            secure: false, // Set to true in production
                            sameSite: "strict",
                            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
                        });

                        // Find the user and attach it to the request object
                        const user = await User.findById(decodeRefresh.user).select("-password");
                        req.user = user; // Attaching user to the request object for later use
                        next();
                    } catch (refreshErr) {
                        console.error(refreshErr);
                        res.status(403);
                        throw new Error("Refresh token is invalid or expired");
                    }
                } else {
                    res.status(401);
                    throw new Error("Access token expired and no refresh token provided");
                }
            } else {
                console.error(err);
                res.status(401);
                throw new Error("User not authorized, token verification failed");
            }
        }
    } else {
        res.status(401);
        throw new Error("Not authorized, no token provided");
    }
};

module.exports = verifyUser;
