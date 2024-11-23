const jwt = require("jsonwebtoken");

function genarateAccesTocken(res, admin) {
  const token = jwt.sign({ admin }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1m",
  });

  res.cookie("accessToken", token, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 1 * 60 * 1000,
  });
}
function genarateAccesTockenUser(res, user) {
  const token = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "1m",
  });

  res.cookie("userAccessTocken", token, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 1 * 60 * 1000,
  });
}



module.exports = { genarateAccesTocken, genarateAccesTockenUser };
