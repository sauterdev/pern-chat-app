const redisClient = require('../../redis');

const addFriend = async (socket, friendName, cb) => {
  //checks if adding self as friend before querying redis

  if (friendName === socket.user.username) {
    cb({ done: false, errorMsg: 'Cannot add self' });
    return;
  }

  const friend = await redisClient.hgetall(`userid:${friendName}`);

  const currentFriendList = await redisClient.lrange(`friends:${socket.user.username}`, 0, -1);

  if (!friend.userid) {
    cb({ done: false, errorMsg: 'User doesnt exist' });
    return;
  }

  //checks if there is a friend list and not adding existing friend
  if (currentFriendList && currentFriendList.indexOf(`${friendName}.${friend.userid}`) !== -1) {
    cb({ done: false, errorMsg: `Friend already added` });
    return;
  }

  //adds friend and id as a string
  await redisClient.lpush(`friends:${socket.user.username}`, [friendName, friend.userid].join('.'));

  const newFriend = {
    username: friendName,
    userid: friend.userid,
    connected: friend.connected,
  };
  cb({ done: true, newFriend });
};

module.exports = addFriend;
