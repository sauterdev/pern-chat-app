const express = require('express');
const validateForm = require('../controllers/express/validateForm');
const router = express.Router();
const { handleLogin, attemptLogin, attemptRegister } = require('../controllers/authContoller');
const { rateLimiter } = require('../controllers/express/rateLimiter');

//logic is passed from authController. Keeps routes and logic separate
router.route('/login').get(handleLogin).post(validateForm, rateLimiter(60, 10), attemptLogin);

router.post('/signup', validateForm, rateLimiter(30, 4), attemptRegister);

module.exports = router;
