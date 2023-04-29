exports.sanatizeUser = function (user) {
  return {
    email: user.email,
    username: user.username,
    name: user.name,
    _id: user._id,
  };
  
};