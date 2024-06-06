const socket = io();

socket.on("message", (msg) => {
  console.log(msg);
});

socket.on("locationMessage", (coordinates) => {
  console.log(
    `http://www.google.com/maps?q=${coordinates.lat},${coordinates.long}`
  );
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
