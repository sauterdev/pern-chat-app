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
  await redisClient.hset(`userid:${socket.user.username}`, 'userid', socket.user.userid);
  const friendList = await redisClient.lrange(`friends:${socket.user.username}`, 0, -1);
  //emit sends event to front end socket client called friends with friendList array
  socket.emit('friends', friendList);
  console.log('userID:', socket.user.userid, ' Username:', socket.user.username);
};

module.exports.addFriend = async (socket, friendName, cb) => {
  //checks if adding self as friend before querying redis

  if (friendName === socket.user.username) {
    cb({ done: false, errorMsg: 'Cannot add self' });
    return;
  }

  const friendUserID = await redisClient.hget(`userid:${friendName}`, 'userid');

  const currentFriendList = await redisClient.lrange(`friends:${socket.user.username}`, 0, -1);

  if (!friendUserID) {
    cb({ done: false, errorMsg: 'User doesnt exist' });
    return;
  }

  //checks if there is a friend list and not adding existing friend
  if (currentFriendList && currentFriendList.indexOf(friendName) !== -1) {
    cb({ done: false, errorMsg: `Friend already added` });
    return;
  } else {
    //adds friend
    await redisClient.lpush(`friends:${socket.user.username}`, friendName);
    cb({ done: true });
  }
};
