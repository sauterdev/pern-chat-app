import { TabPanel, TabPanels, Text, VStack } from '@chakra-ui/react';
import React, { useContext, useEffect, useRef } from 'react';
import { FriendContext, MessagesContext } from './Home';
import ChatBox from './ChatBox';

const Chat = ({ userid }) => {
  const { friendList } = useContext(FriendContext);
  const { messages } = useContext(MessagesContext);
  const bottomDiv = useRef(null);

  //takes focus to new message when one is sent
  useEffect(() => {
    bottomDiv.current?.scrollIntoView();
  });

  return friendList.length > 0 ? (
    <VStack h="100%" justify="end">
      <TabPanels overflowY="scroll">
        {friendList.map((friend) => (
          <VStack flexDir="column-reverse" as={TabPanel} key={`chat:${friend.username}`} w="100%">
            <div ref={bottomDiv} />
            {messages
              .filter((message) => message.to === friend.userid || message.from === friend.userid)
              .map((message, idx) => (
                <Text
                  m={
                    //'important' designation overrides chakra ui
                    message.to === friend.userid ? '1rem 0 0 auto !important' : '1rem auto 00 !important'
                  }
                  maxW="50%"
                  key={`message:${friend.usernme}.${idx}`}
                  fontSize="lg"
                  bg={message.to === friend.userid ? 'blue.100' : 'gray.100'}
                  color="gray.800"
                  borderRadius="10px"
                  p=".5rem 1rem"
                >
                  {message.content}
                </Text>
              ))}
          </VStack>
        ))}
      </TabPanels>
      <ChatBox userid={userid} />
    </VStack>
  ) : (
    <VStack justify="center" pt="5rem" w="100%" textAlign="center" fontSize="lg">
      <TabPanels>
        <TabPanel>
          <Text> No Friends. Click add friend to start chatting</Text>
        </TabPanel>
      </TabPanels>
    </VStack>
  );
};

export default Chat;
