import { VStack, ButtonGroup, Button, Heading, Text } from '@chakra-ui/react';
import { Formik, Form } from 'formik';
import React, { useContext, useState } from 'react';
import * as Yup from 'yup';
import TextField from '../TextField';
import { useNavigate } from 'react-router-dom';
import { ArrowBackIcon } from '@chakra-ui/icons';
import { AccountContext } from '../AccountContext';

const SignUp = () => {
  const { setUser } = useContext(AccountContext);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  return (
    <Formik
      initialValues={{ username: '', password: '' }} //values need to match props being passed in to TextField ln 24,26
      validationSchema={Yup.object({
        //Yup verifies input schema
        username: Yup.string().required('Username Required').min(6, 'Username too short').max(28, 'Username too long'),
        password: Yup.string().required('Password Required').min(6, 'Password too short').max(28, 'Password too long'),
      })}
      onSubmit={(values, actions) => {
        const vals = { ...values }; //store values before resetting form
        actions.resetForm();
        fetch('http://localhost:4000/auth/signup', {
          //object to configure request
          method: 'POST',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(vals),
        })
          .catch((err) => {
            return;
          })
          .then((res) => {
            if (!res || !res.ok || res.status >= 400) {
              return;
            }
            //console.log(res);
            return res.json();
          })
          .then((data) => {
            if (!data) return;
            //saving user that has login set to true
            setUser({ ...data });
            if (data.status) {
              //if status on the data response from authRouter, set error to it for display
              setError(data.status);
            } else if (data.loggedIn) {
              //store jwt in local
              localStorage.setItem('token', data.token);
              navigate('/home');
            }
          });
      }}
    >
      <VStack as={Form} w={{ base: '90%', md: '500px' }} m="auto" justify="center" h="100vh" spacing="1rem">
        <Heading>Sign Up</Heading>

        {/* display log in error if there is one from error context ln 49 */}
        <Text as="p" color="red.500">
          {error}
        </Text>
        <TextField name="username" placeholder="Enter username" autoComplete="off" label="Username" />

        <TextField name="password" placeholder="Enter password" autoComplete="off" label="Password" type="password" />

        <ButtonGroup pt="1rem">
          <Button colorScheme="teal" type="submit">
            Create Account
          </Button>
          <Button onClick={() => navigate('/')} leftIcon={<ArrowBackIcon />}>
            Back
          </Button>
        </ButtonGroup>
      </VStack>
    </Formik>
  );
};

export default SignUp;
