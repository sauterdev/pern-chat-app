const express = require('express');
const { Server } = require('socket.io');
const app = express();
const helmet = require('helmet'); //fills gap between node and express by securing http headers returned by express
const cors = require('cors');
const authRouter = require('./routers/authRouter');
const session = require('express-session');
const Redis = require('ioredis');
//create a server and every http request passes through express app
const server = require('http').createServer(app);
const RedisStore = require('connect-redis').default;
require('dotenv').config();

//instance of server where socketIo is hosted
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
});

//middleware, every request going to express app goes through
const redisClient = new Redis();
app.use(helmet()); //http security features
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
);
app.use(express.json()); //parses json coming though server to be treated like js object
app.use(
  //sets cookie info for the session
  session({
    secret: process.env.COOKIE_SECRET,
    credentials: true,
    name: 'sid',
    store: new RedisStore({ client: redisClient }),
    resave: false, //only saves session if something changes
    saveUninitialized: false, //only sets cookie on browswer if user logs in
    cookie: {
      secure: process.env.ENVIRONMENT === 'production' ? 'true' : 'auto',
      httpOnly: true,
      expires: 1000 * 60 * 60 * 24 * 7,
      sameSite: process.env.ENVIRONMENT === 'production' ? 'none' : 'lax',
    },
  }),
);
app.use('/auth', authRouter); //any request to /auth will run authRouter

//when socketIo receives a connection it runs callback
io.on('connect', (socket) => {});

server.listen(4000, () => {
  console.log('Server listening on port 4000');
});
