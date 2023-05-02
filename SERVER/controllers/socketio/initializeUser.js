const redisClient = require('../../redis');
const parseFriendList = require('./parseFriendList');

//initializes user with static hashed userid through redis
const initializeUser = async (socket) => {
  //socket.user = { ...socket.request.session.user };
  //permanent user id is joined, it is the room id that all friends will communicate too
  socket.join(socket.user.userid);
  await redisClient.hset(`userid:${socket.user.username}`, 'userid', socket.user.userid, 'connected', true);

  const friendList = await redisClient.lrange(`friends:${socket.user.username}`, 0, -1);

  const parsedFriendList = await parseFriendList(friendList);
  //get array of IDs with friend list to send to front end
  const friendRooms = parsedFriendList.map((friend) => friend.userid);
  //emit to all friends that we are online
  console.log(friendRooms);
  console.log(parsedFriendList);
  if (friendRooms.length > 0) socket.to(friendRooms).emit('connected', true, socket.user.username);

  //emit sends event to front end socket client called friends with friendList array
  socket.emit('friends', parsedFriendList);

  //get array of existing messages with friend
  const msgQuery = await redisClient.lrange(`chat:${socket.user.userid}`, 0, -1);

  //to.from.content
  const messages = msgQuery.map((msgStr) => {
    const parsedStr = msgStr.split('.');
    return { to: parsedStr[0], from: parsedStr[1], content: parsedStr[3] };
  });

  //send messages if they are present
  if (messages && messages.length > 0) {
    socket.emit('messages', messages);
  }
};

module.exports = initializeUser;
