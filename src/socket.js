import { io } from 'socket.io-client';

//connects react front end to back with socket
const socket = new io('http://localhost:4000', {
  autoConnect: false,
  withCredentials: true,
});

export default socket;
