//socket middleware. Checks if socket request has an session object and user object to give access to socketio server

module.exports.authorizeUser = (socket, next) => {
  if (!socket.request.session || !socket.request.session.user) {
    console.log('Bad request');
    next(new Error('Not authorized'));
  } else {
    next();
  }
};
