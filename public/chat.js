const socket = io();

const allMessages = document.querySelector("#messages");
const messageTemplate = document.querySelector("#msg-template").innerHTML;
const locationMessageTemplate = document.querySelector(
  "#location-msg-template"
).innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

// turning queryString into object
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const params = {};
for (const [key, value] of urlParams.entries()) {
  params[key] = value;
}
const { username, room } = params;
// console.log(username, room);

function autoScroll() {
  const messages = document.getElementById("messages");
  const newMessage = messages.lastElementChild;
  const newMessageStyles = getComputedStyle(newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = newMessage.offsetHeight + newMessageMargin;
  const visibleHeight = messages.offsetHeight;
  const containerHeight = messages.scrollHeight;
  const scrollOffset = messages.scrollTop + visibleHeight;

  if (containerHeight - newMessageHeight <= scrollOffset) {
    messages.scrollTop = messages.scrollHeight;
  }
}

socket.on("message", (message) => {
  console.log(message);
  const html = Mustache.render(messageTemplate, {
    username: message.username,
    msg: message.text,
    createdAt: moment(message.createdAt).format("h:mm a"),
  });
  allMessages.insertAdjacentHTML("beforeend", html);
  autoScroll();
});

socket.on("locationMessage", (coordinates) => {
  console.log(
    `http://www.google.com/maps?q=${coordinates.lat},${coordinates.long}`
  );
  // const url = `http://www.google.com/maps?q=${coordinates.lat},${coordinates.long}`;
  const html = Mustache.render(locationMessageTemplate, {
    username: coordinates.username,
    url: coordinates.url,
    createdAt: moment(coordinates.createdAt).format("h:mm a"),
  });
  allMessages.insertAdjacentHTML("beforeend", html);
  autoScroll();
});

socket.on("roomData", ({ room, users }) => {
  const html = Mustache.render(sidebarTemplate, {
    room,
    users,
  });
  document.querySelector("#sidebar").innerHTML = html;
  autoScroll();
});

const chatForm = document.querySelector("#chat-form");
const inputMsg = chatForm.querySelector("input");
const sendButton = chatForm.querySelector("button");

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (inputMsg.value === "") return;

  sendButton.setAttribute("disabled", "disabled");

  const message = inputMsg.value;
  socket.emit("sendMessage", message, (err) => {
    sendButton.removeAttribute("disabled");
    inputMsg.value = "";
    inputMsg.focus();

    if (err) {
      console.log(err);
    } else {
      console.log("message sent successfully");
    }
  });
});

const shareLocationBtn = document.querySelector("#share-location");

shareLocationBtn.addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit("sendLocation", {
      lat: position.coords.latitude,
      long: position.coords.longitude,
    });
  });
});

socket.emit("join", { username, room }, (err) => {
  if (err) {
    alert(err);
    window.location.href = "/";
  }
});
