const socket = io();

const allMessages = document.querySelector("#messages");
const messageTemplate = document.querySelector("#msg-template").innerHTML;
const locationMessageTemplate = document.querySelector(
  "#location-msg-template"
).innerHTML;

socket.on("message", (message) => {
  console.log(message);
  const html = Mustache.render(messageTemplate, {
    msg: message.text,
    createdAt: moment(message.createdAt).format("h:mm a"),
  });
  allMessages.insertAdjacentHTML("beforeend", html);
});

socket.on("locationMessage", (coordinates) => {
  console.log(
    `http://www.google.com/maps?q=${coordinates.lat},${coordinates.long}`
  );
  const url = `http://www.google.com/maps?q=${coordinates.lat},${coordinates.long}`;
  const html = Mustache.render(locationMessageTemplate, {
    url: coordinates.url,
    createdAt: moment(coordinates.createdAt).format("h:mm a"),
  });
  allMessages.insertAdjacentHTML("beforeend", html);
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
