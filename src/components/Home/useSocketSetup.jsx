import { useContext, useEffect } from 'react';
import socket from '../../socket';
import { AccountContext } from '../AccountContext';

import(useContext);
const useSocketSetup = (setFriendList) => {
  const { setUser } = useContext(AccountContext);
  useEffect(() => {
    socket.connect();
    //receives event from socketController back end to populate friend list in the
    socket.on('friends', (friendList) => {
      setFriendList(friendList);
    });
    socket.on('connected', (status, username) => {
      setFriendList((prevFriends) => {
        const friends = [...prevFriends];
        return friends.map((friend) => {
          if (friend.username === username) {
            friend.connected = status;
          }
          return friend;
        });
      });
    });
    socket.on('connect_error', () => {
      //logs user out in the case that there is an error connecting
      setUser({ loggedIn: false });
    });

    //returning socket.off prevents duplicate callings of socket.on
    return () => {
      socket.off('connect_error');
    };
  }, [setUser]);
};

export default useSocketSetup;
