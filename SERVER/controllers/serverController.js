const session = require('express-session');
const redisClient = require('../redis');
const RedisStore = require('connect-redis').default;
require('dotenv').config();

const sessionMiddleware = session({
  secret: process.env.COOKIE_SECRET,
  credentials: true,
  name: 'sid',
  store: new RedisStore({ client: redisClient }),
  resave: false, //only saves session if something changes
  saveUninitialized: false, //only sets cookie on browswer if user logs in
  cookie: {
    secure: process.env.NODE_ENV === 'production' ? 'true' : 'auto',
    httpOnly: true,
    expires: 1000 * 60 * 60 * 24 * 7,
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  },
});

//function that returns function that is the socket middleware.
//Any middleware from express that needs to be used with IO gets wrapped
const wrap = (expressMiddleware) => (socket, next) => expressMiddleware(socket.request, {}, next);

const corsConfig = {
  origin: 'http://localhost:3000',
  credentials: true,
};

module.exports = { sessionMiddleware, wrap, corsConfig };
