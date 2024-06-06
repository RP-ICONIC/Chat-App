const socket = io();

socket.on("message", (msg) => {
  console.log(msg);
});

socket.on("locationMessage", (coordinates) => {
  console.log(
    `http://www.google.com/maps?q=${coordinates.lat},${coordinates.long}`
  );
});

document.querySelector("form").addEventListener("submit", (e) => {
  e.preventDefault();
  const message = document.querySelector("input").value;
  socket.emit("sendMessage", message);
});

document.querySelector("#share-location").addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition((position) => {
    socket.emit("sendLocation", {
      lat: position.coords.latitude,
      long: position.coords.longitude,
    });
  });
});
