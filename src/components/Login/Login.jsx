import {
  VStack,
  ButtonGroup,
  FormControl,
  FormLabel,
  Button,
  FormErrorMessage,
  Input,
  Heading,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import React from 'react';
import * as Yup from 'yup';

const Login = () => {
  const formik = useFormik({
    initialValues: { username: '', password: '' }, //keys must match names in forms in the VStack
    validationSchema: Yup.object({
      username: Yup.string().required('Username Required').min(6, 'Username too short').max(28, 'Username too long'),
      password: Yup.string().required('Password Required').min(6, 'Password too short').max(28, 'Password too long'),
    }),
  });
  return (
    <VStack as="form" w={{ base: '90%', md: '500px' }} m="auto" justify="center" h="100vh" spacing="1rem">
      <Heading>Log In</Heading>
      <FormControl>
        <FormLabel fontSize="lg">Username</FormLabel>
        <Input name="username" placeholder="Enter Username" autoComplete="off" size="lg" />
        <FormErrorMessage>Invalid Username</FormErrorMessage>
      </FormControl>

      <FormControl>
        <FormLabel fontSize="lg">Password</FormLabel>
        <Input name="password" placeholder="Enter Password" autoComplete="off" size="lg" />
        <FormErrorMessage>Invalid Password</FormErrorMessage>
      </FormControl>

      <ButtonGroup pt="1rem">
        <Button colorScheme="teal" type="submit">
          Log In
        </Button>
        <Button>Create Account</Button>
      </ButtonGroup>
    </VStack>
  );
};

export default Login;
