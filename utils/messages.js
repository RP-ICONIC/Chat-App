const generateMessage = (username, text) => {
  return {
    username,
    text,
    createdAt: new Date().getTime(),
  };
};

const locationMessage = (username, coords) => {
  const url = `http://www.google.com/maps?q=${coords.lat},${coords.long}`;
  return {
    username,
    url,
    createdAt: new Date().getTime(),
  };
};
module.exports = { generateMessage, locationMessage };
