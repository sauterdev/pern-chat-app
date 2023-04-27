import { FormControl, FormErrorMessage, FormLabel, Input } from '@chakra-ui/react';
import { Field, useField } from 'formik';

const TextField = ({ label, ...props }) => {
  const [field, meta] = useField(props);

  return (
    //isInvalid doesnt activate verification errors until entries are attempted
    <FormControl isInvalid={meta.touched && meta.error}>
      <FormLabel>{label}</FormLabel>
      {/* Input properties handle onChange, onSubmit, onBlur etc */}
      <Input as={Field} {...field} {...props} />
      <FormErrorMessage>{meta.error}</FormErrorMessage>
    </FormControl>
  );
};

export default TextField;
