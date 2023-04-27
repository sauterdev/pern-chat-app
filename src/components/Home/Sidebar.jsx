import { ChatIcon } from '@chakra-ui/icons';
import { Button, Circle, Divider, HStack, Heading, Tab, TabList, Text, VStack } from '@chakra-ui/react';
import React, { useContext } from 'react';
import { FriendContext } from './Home';

function Sidebar() {
  const { friendList, setFriendList } = useContext(FriendContext);
  return (
    <VStack py="1.4rem">
      <HStack justify="space-evenly" w="100%">
        <Heading size="md">Add Friend</Heading>
        <Button>
          <ChatIcon />
        </Button>
      </HStack>
      <Divider />
      <VStack as={TabList}>
        {/* <HStack as={Tab}>
          <Circle background="red.500" w="15px" h="15px" />
          <Text>John Smith</Text>
        </HStack>
        <HStack as={Tab}>
          <Circle background="green.700" w="15px" h="15px" />
          <Text>John Smith</Text>
        </HStack> */}
        {friendList.map((friend) => {
          return (
            <HStack as={Tab}>
              <Circle background={friend.connected ? 'green.700' : 'red.500'} w="15px" h="15px" />
              <Text>{friend.username}</Text>
            </HStack>
          );
        })}
      </VStack>
    </VStack>
  );
}

export default Sidebar;
