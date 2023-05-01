const redisClient = require('../../redis');

//parses friend list with names, IDs, and online status into an array
const parseFriendList = async (friendList) => {
  const newFriendList = [];
  for (let friend of friendList) {
    const parsedFriend = friend.split('.');
    const friendConnected = await redisClient.hget(`userid:${parsedFriend[0]}`, 'connected');
    newFriendList.push({
      username: parsedFriend[0],
      userid: parsedFriend[1],
      connected: friendConnected,
    });
  }
  return newFriendList;
};

module.exports = parseFriendList;
