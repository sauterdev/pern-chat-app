import { useContext, useEffect } from 'react';
import { AccountContext } from '../AccountContext';

const useSocketSetup = (setFriendList, setMessages, socket) => {
  const { setUser } = useContext(AccountContext);
  useEffect(() => {
    socket.connect();
    //receives event from socketController back end to populate friend list in the
    socket.on('friends', (friendList) => {
      setFriendList(friendList);
    });
    socket.on('messages', (messages) => {
      setMessages(messages);
    });
    socket.on('dm', (message) => {
      setMessages((prevMessages) => [message, ...prevMessages]);
    });
    socket.on('connected', (status, username) => {
      setFriendList((prevFriends) => {
        return [...prevFriends].map((friend) => {
          console.log('checking connected', friend);
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
      socket.off('connected');
      socket.off('friends');
      socket.off('messages');
    };
  }, [setUser, setFriendList, setMessages, socket]);
};

export default useSocketSetup;
