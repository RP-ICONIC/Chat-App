const users = [];

const addUser = ({ id, username, room }) => {
  if (!username || !room) {
    return { err: "username and room both required" };
  }

  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  const isExist = users.find((user) => {
    return user.room === room && user.username === username;
  });

  if (isExist) {
    return { err: "username is in use, please try different one" };
  }

  const user = { id, username, room };
  users.push(user);
  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => {
    return user.id === id;
  });

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

const getUser = (id) => {
  return users.find((user) => {
    return user.id === id;
  });
};

const getUsersOfRoom = (room) => {
  return users.filter((user) => {
    return user.room === room;
  });
};

module.exports = { addUser, getUser, removeUser, getUsersOfRoom };

// const x = addUser({
//   id: 20,
//   username: "Rudra",
//   room: "2303",
// });

// // console.log(users);

// const y = addUser({
//   id: 21,
//   username: "  rudra ",
//   room: "233 ",
// });

// addUser({
//   id: 22,
//   username: "  het ",
//   room: "233 ",
// });

// // console.log(users);
// // const z = getUser(20);
// // console.log(z);
// // const z = removeUser(21);

// console.log(getUsersOfRoom("233"));
// // console.log(users, z);
