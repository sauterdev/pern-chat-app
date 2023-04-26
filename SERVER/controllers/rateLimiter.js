const redisClient = require('../redis');

module.exports.rateLimiter =
  //returns function that takes parameters passed from authRouter. Allows different limit amounts for log in vs register
  (secondsLimit, limitAmount) => async (req, res, next) => {
    const ip = req.connection.remoteAddress.slice(0, 4);
    //tracks requests from ip address and increments if address is the same. requests expire after 60 seconds
    const [response] = await redisClient.multi().incr(ip).expire(ip, secondsLimit).exec();
    // prevents 10 attempts to hit database in 1 minute
    if (response[1] > limitAmount) {
      res.json({ loggedIn: false, status: 'Slow down! Try again in a minute.' });
    } else {
      next();
    }
  };
