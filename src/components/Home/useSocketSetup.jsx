import { useContext, useEffect } from 'react';
import socket from '../../socket';
import { AccountContext } from '../AccountContext';

import(useContext);
const useSocketSetup = () => {
  const { setUser } = useContext(AccountContext);
  useEffect(() => {
    socket.connect();
    socket.on('connect_error', () => {
      setUser({ loggedIn: false });
    });

    //returning socket.off prevents duplicate callings of socket.on
    return () => {
      socket.off('connect_error');
    };
  }, [setUser]);
};

export default useSocketSetup;
