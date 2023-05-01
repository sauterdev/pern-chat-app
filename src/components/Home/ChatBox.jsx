import React, { useContext } from 'react';
import { Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Button, HStack, Input } from '@chakra-ui/react';
import socket from '../../socket';
import { MessagesContext } from './Home';

const ChatBox = ({ userid }) => {
  const { setMessages } = useContext(MessagesContext);
  return (
    <Formik
      initialValues={{ message: '' }}
      validationSchema={Yup.object({
        message: Yup.string().min(1).max(255),
      })}
      onSubmit={(values, actions) => {
        const message = { to: userid, from: null, content: values.message };
        socket.emit('dm', message);
        setMessages((prevMessages) => [message, ...prevMessages]);
        actions.resetForm();
      }}
    >
      <HStack as={Form} w="100%" pb="1.4rem" px="1.4rem">
        <Input as={Field} name="message" placeholder="Type message here..." size="lg" autoComplete="off" />
        <Button type="submit" size="lg" colorScheme="teal">
          Send
        </Button>
      </HStack>
    </Formik>
  );
};

export default ChatBox;
