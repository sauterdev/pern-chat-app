import React from 'react';
import {
  Button,
  ModalOverlay,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@chakra-ui/react';
import TextField from '../TextField';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';

const AddFriendModal = ({ isOpen, onClose }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add A Friend!</ModalHeader>
        <ModalCloseButton />
        <Formik
          initialValues={{ friendName: '' }}
          validationSchema={Yup.object({
            friendName: Yup.string()
              .required('Username Required')
              .min(6, 'Username too short')
              .max(28, 'Username too long'),
          })}
          onSubmit={(values, actions) => {
            onClose();
          }}
        >
          <Form>
            <ModalBody>
              <TextField
                label="Friend's Name"
                placeholder="Enter Friend's Username"
                autocomplete="off"
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
