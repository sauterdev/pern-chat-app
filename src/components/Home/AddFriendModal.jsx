import React, { useCallback, useContext, useState } from 'react';
import {
  Button,
  ModalOverlay,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Heading,
} from '@chakra-ui/react';
import TextField from '../TextField';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import socket from '../../socket';
import { FriendContext } from './Home';

const AddFriendModal = ({ isOpen, onClose }) => {
  const [error, setError] = useState('');
  //clears out error message on modal when closed
  const closeModal = useCallback(() => {
    setError('');
    onClose();
  }, [onClose]);
  const { setFriendList } = useContext(FriendContext);

  return (
    <Modal isOpen={isOpen} onClose={closeModal} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add A Friend!</ModalHeader>
        <ModalCloseButton />
        <Formik
          initialValues={{ friendName: '' }}
          onSubmit={(values) => {
            //sends username friend info to socketio server. Emit triggers event in server
            socket.emit('add_friend', values.friendName, ({ errorMsg, done, newFriend }) => {
              //if no errors, close modal and return from onsubmit fxn
              if (done) {
                setFriendList((c) => [newFriend, ...c]);
                closeModal();
                return;
              }
              setError(errorMsg);
            });
          }}
          validationSchema={Yup.object({
            friendName: Yup.string()
              .required('Username Required')
              .min(6, 'Username too short')
              .max(28, 'Username too long'),
          })}
        >
          <Form>
            <ModalBody>
              <Heading as="p" color="red.500" textAlign="center" fontSize="md">
                {error}
              </Heading>
              <TextField
                label="Friend's Name"
                placeholder="Enter Friend's Username"
                autoComplete="off"
                name="friendName"
              />
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="blue" type="submit">
                Submit
              </Button>
            </ModalFooter>
          </Form>
        </Formik>
      </ModalContent>
    </Modal>
  );
};

export default AddFriendModal;
