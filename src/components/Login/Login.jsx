import { VStack, ButtonGroup, Button, Heading } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import React from 'react';
import * as Yup from 'yup';
import TextField from './TextField';

const Login = () => {
  return (
    <Formik
      initialValues={{ username: '', password: '' }} //values need to match props being passed in to TextField ln 24,26
      validationSchema={Yup.object({
        //Yup verifies input schema
        username: Yup.string().required('Username Required').min(6, 'Username too short').max(28, 'Username too long'),
        password: Yup.string().required('Password Required').min(6, 'Password too short').max(28, 'Password too long'),
      })}
      onSubmit={(values, actions) => {
        alert(JSON.stringify(values, null, 2));
        actions.resetForm();
      }}
    >
      <VStack as={Form} w={{ base: '90%', md: '500px' }} m="auto" justify="center" h="100vh" spacing="1rem">
        <Heading>Log In</Heading>

        <TextField name="username" placeholder="Enter username" autoComplete="off" />

        <TextField name="password" placeholder="Enter password" autoComplete="off" />

        <ButtonGroup pt="1rem">
          <Button colorScheme="teal" type="submit">
            Log In
          </Button>
          <Button>Create Account</Button>
        </ButtonGroup>
      </VStack>
    </Formik>
  );
};

export default Login;
