const generateMessage = (text) => {
  return {
    text,
    createdAt: new Date().getTime(),
  };
};

const locationMessage = (coords) => {
  const url = `http://www.google.com/maps?q=${coords.lat},${coords.long}`;
  return {
    url,
    createdAt: new Date().getTime(),
  };
};
module.exports = { generateMessage, locationMessage };
