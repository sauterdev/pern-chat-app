const pool = require('../db');
const bcrypt = require('bcrypt');

//keep routes seperate from logic

module.exports.handleLogin = (req, res) => {
  if (req.session.user && req.session.user.username) {
    res.json({ loggedIn: true, username: req.session.user.username });
  } else {
    res.json({ loggedIn: false });
  }
};

module.exports.attemptLogin = async (req, res) => {
  const potentialLogin = await pool.query('SELECT id, username, passhash FROM users u WHERE u.username=$1', [
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
      };

      res.json({ loggedIn: true, username: req.body.username });
    } else {
      res.json({ loggedIn: false, status: 'Wrong username or password' });
    }
  } else {
    res.json({ loggedIn: false, status: 'Wrong username or password' });
  }
};

module.exports.attemptRegister = async (req, res) => {
  const existingUser = await pool.query('SELECT username FROM users WHERE username=$1', [req.body.username]);

  if (existingUser.rowCount === 0) {
    //register
    const hashedPass = await bcrypt.hash(req.body.password, 10);
    const newUserQuery = await pool.query(
      'INSERT INTO users(username, passhash) values($1, $2) RETURNING id, username',
      [req.body.username, hashedPass],
    );
    //session sets cookie on the browswer so user doesnt have to relog when refreshing the page
    req.session.user = {
      username: req.body.username,
      id: newUserQuery.rows[0].id,
    };
    res.json({ loggedIn: true, username: req.body.username });
  } else {
    res.json({ loggedIn: false, status: 'Username taken' });
  }
};