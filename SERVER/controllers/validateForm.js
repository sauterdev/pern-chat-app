const Yup = require('yup');

const formSchema = Yup.object({
  //Yup verifies input schema
  username: Yup.string().required('Username Required').min(6, 'Username too short').max(28, 'Username too long'),
  password: Yup.string().required('Password Required').min(6, 'Password too short').max(28, 'Password too long'),
});

//using 'next' sets up validate form as a middleware. once run, it 'passes' to next middleware
const validateForm = (req, res, next) => {
  const formData = req.body;
  //validates form entries, returns a promise for .catch/.then
  formSchema
    .validate(formData)
    .catch((err) => {
      res.status(422).send();
      console.log(err.errors);
    })
    .then((valid) => {
      if (valid) {
        console.log('form is good');
        next();
      } else {
        res.status(422).send();
      }
    });
};

module.exports = validateForm;
