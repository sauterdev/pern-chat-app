const redisClient = require('../redis');

//socket middleware.

//Checks if socket request has an session object and user object to give access to socketio server
module.exports.authorizeUser = (socket, next) => {
  if (!socket.request.session || !socket.request.session.user) {
    console.log('Bad request');
    next(new Error('Not authorized'));
  } else {
    next();
  }
};

//initializes user with static hashed userid through redis
module.exports.initializeUser = async (socket) => {
  socket.user = { ...socket.request.session.user };
  //permanent user id is joined, it is the room id that all friends will communicate too
  socket.join(socket.user.userid);
  await redisClient.hset(`userid:${socket.user.username}`, 'userid', socket.user.userid, 'connected', true);
  const friendList = await redisClient.lrange(`friends:${socket.user.username}`, 0, -1);

  const parsedFriendList = await parseFriendList(friendList);
  //get array of IDs with friend list to send to front end
  const friendRooms = parsedFriendList.map((friend) => friend.userid);
  //emit to all friends that we are online
  if (friendRooms.length > 0) socket.to(friendRooms).emit('connected', true, socket.user.username);

  //emit sends event to front end socket client called friends with friendList array
  console.log(`${socket.user.username} friends:`, parsedFriendList);
  socket.emit('friends', parsedFriendList);
};

module.exports.addFriend = async (socket, friendName, cb) => {
  //checks if adding self as friend before querying redis

  if (friendName === socket.user.username) {
    cb({ done: false, errorMsg: 'Cannot add self' });
    return;
  }

  const friend = await redisClient.hgetall(`userid:${friendName}`);

  const currentFriendList = await redisClient.lrange(`friends:${socket.user.username}`, 0, -1);

  if (!friend) {
    cb({ done: false, errorMsg: 'User doesnt exist' });
    return;
  }

  //checks if there is a friend list and not adding existing friend
  if (currentFriendList && currentFriendList.indexOf(friendName) !== -1) {
    cb({ done: false, errorMsg: `Friend already added` });
    return;
  } else {
    //adds friend and id as a string
    await redisClient.lpush(`friends:${socket.user.username}`, [friendName, friend.userid].join('.'));

    const newFriend = {
      username: friendName,
      userid: friend.userid,
      connected: friend.connected,
    };
    cb({ done: true, newFriend });
  }
};

module.exports.onDisconnect = async (socket) => {
  await redisClient.hset(`userid:${socket.user.username}`, 'connected', false);
  const friendList = await redisClient.lrange(`friends:${socket.user.username}`, 0, -1);
  //get array of IDs off friend list
  const friendRooms = await parseFriendList(friendList).then((friends) => friends.map((friend) => friend.userid));
  //emit to all friends that we are offline
  socket.to(friendRooms).emit('connected', false, socket.user.username);
};

//parses friend list with names, IDs, and online status into an array
const parseFriendList = async (friendList) => {
  const newFriendList = [];
  for (let friend of friendList) {
    const parsedFriend = friend.split('.');
    const friendConnected = await redisClient.hget(`userid:${parsedFriend[0]}`, 'connected');
    newFriendList.push({ username: parsedFriend[0], userid: parsedFriend[1], connected: friendConnected });
  }
  return newFriendList;
};
