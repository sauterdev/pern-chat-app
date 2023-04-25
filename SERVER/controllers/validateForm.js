const Yup = require('yup');

const formSchema = Yup.object({
  //Yup verifies input schema
  username: Yup.string().required('Username Required').min(6, 'Username too short').max(28, 'Username too long'),
  password: Yup.string().required('Password Required').min(6, 'Password too short').max(28, 'Password too long'),
});

const validateForm = (req, res) => {
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
        res.status(200).send();
        console.log('form is good');
      }
    });
};

module.exports = validateForm;
