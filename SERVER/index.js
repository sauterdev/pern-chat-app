const express = require('express');
const { Server } = require('socket.io');
const helmet = require('helmet'); //fills gap between node and express by securing http headers returned by express
const cors = require('cors');
const authRouter = require('./routers/authRouter');

const app = express();

//create a server and every http request passes through express app
const server = require('http').createServer(app);

//instance of server where socketIo is hosted
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    credentials: true,
  },
});

//middleware, every request going to express app goes through
app.use(helmet()); //http security features
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  }),
);
app.use(express.json()); //parses json coming though server to be treated like js object
app.use('/auth', authRouter); //any request to /auth will run authRouter

app.get('/', (req, res) => {
  res.json('hi');
});

//when socketIo receives a connection it runs callback
io.on('connect', (socket) => {});

server.listen(4000, () => {
  console.log('Server listening on port 4000');
});
