import { ChatIcon } from '@chakra-ui/icons';
import { Button, Circle, Divider, HStack, Heading, Tab, TabList, Text, VStack, useDisclosure } from '@chakra-ui/react';
import React, { useContext } from 'react';
import { FriendContext } from './Home';
import AddFriendModal from './AddFriendModal';

import { AccountContext } from '../AccountContext';

function Sidebar() {
  const { friendList } = useContext(FriendContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  // const { setUser } = useContext(AccountContext);

  const logOff = () => {
    // localStorage.removeItem('token');
    // setUser({
    //   loggedIn: false,
    // });
  };

  return (
    <>
      <VStack py="1.4rem">
        <HStack justify="space-evenly" w="100%">
          <Heading size="md">Add Friend</Heading>
          <Button onClick={onOpen}>
            <ChatIcon />
          </Button>
          {/* <Button onClick={logOff}>Log Off</Button> */}
        </HStack>
        <Divider />
        <VStack as={TabList}>
          {friendList.map((friend) => {
            return (
              <HStack as={Tab} key={`friend:${friend.userid}`}>
                <Circle bg={'' + friend.connected === 'true' ? 'green.700' : 'red.500'} w="15px" h="15px" />
                <Text>{friend.username}</Text>
              </HStack>
            );
          })}
        </VStack>
      </VStack>
      <AddFriendModal isOpen={isOpen} onClose={onClose} />
    </>
  );
}

export default Sidebar;
