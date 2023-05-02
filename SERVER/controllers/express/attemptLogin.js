const pool = require('../db');
const bcrypt = require('bcrypt');

const attemptLogin = async (req, res) => {
  const potentialLogin = await pool.query('SELECT id, username, passhash, userid FROM users u WHERE u.username=$1', [
    req.body.username,
  ]);

  //check for existing username
  if (potentialLogin.rowCount > 0) {
    //if found, compare password
    const isSamePass = await bcrypt.compare(req.body.password, potentialLogin.rows[0].passhash);
    //if password matches, create session and log in
    if (isSamePass) {
      //login
      req.session.user = {
        username: req.body.username,
        id: potentialLogin.rows[0].id,
        userid: potentialLogin.rows[0].userid,
      };

      res.json({ loggedIn: true, username: req.body.username });
    } else {
      res.json({ loggedIn: false, status: 'Wrong username or password' });
    }
  } else {
    res.json({ loggedIn: false, status: 'Wrong username or password' });
  }
};
module.exports = attemptLogin;
