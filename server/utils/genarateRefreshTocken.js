const jwt = require("jsonwebtoken");

function generateRefreshToken(res, user) {
  const refreshToken = jwt.sign({ user }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "90d", // Typically, refresh tokens have a longer expiration time
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false, // You may want to set this to true in production
    sameSite: "strict",
    maxAge: 90 * 24 * 60 * 60 * 1000, // 90 days
  });
}

module.exports = generateRefreshToken;
