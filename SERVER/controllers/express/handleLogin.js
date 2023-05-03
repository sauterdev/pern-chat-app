const jwt = require('jsonwebtoken');
const { jwtVerify, getJwt } = require('../jwt/jwtAuth');
require('dotenv').config();

const handleLogin = (req, res) => {
  const token = getJwt(req);

  if (!token) {
    res.json({ loggedIn: false });
    return;
  }
  jwtVerify(token, process.env.JWT_SECRET)
    .then(() => {
      res.json({ loggedIn: true, token });
    })
    .catch((err) => {
      console.log(err);
      res.json({ loggedIn: false });
    });
};

module.exports = handleLogin;
