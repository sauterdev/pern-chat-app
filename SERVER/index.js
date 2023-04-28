const express = require('express');

const { Server } = require('socket.io');
const app = express();
const helmet = require('helmet'); //fills gap between node and express by securing http headers returned by express
const cors = require('cors');
const authRouter = require('./routers/authRouter');
const { sessionMiddleware, wrap, corsConfig } = require('./controllers/serverController');
const { authorizeUser } = require('./controllers/socketController');
//create a server and every http request passes through express app
const server = require('http').createServer(app);

//instance of server where socketIo is hosted
const io = new Server(server, {
  cors: corsConfig,
});

//middleware, every request going to express app goes through
app.use(helmet()); //http security features
app.use(cors(corsConfig));
app.use(express.json()); //parses json coming though server to be treated like js object
app.use(sessionMiddleware);
app.use('/auth', authRouter); //any request to /auth will run authRouter

//socket io middleware
io.use(wrap(sessionMiddleware));
io.use(authorizeUser);
//when socketIo receives a connection it runs callback
io.on('connect', (socket) => {
  console.log(socket.id);
  console.log(socket.request.session.user.username);
});

server.listen(4000, () => {
  console.log('Server listening on port 4000');
});
