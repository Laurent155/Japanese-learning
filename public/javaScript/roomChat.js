const socket = io("/");
const messageContainer = document.getElementById("message-container");
const messageForm = document.getElementById("send-container");
const messageInput = document.getElementById("message-input");
const sendMsgBtn = document.getElementById("send-button");
let name;
let id;
const params = new URLSearchParams(window.location.search);
const room = params.get("roomID");
// console.log(room);

socket.emit("room", room);

fetch("/account/username")
  .then((res) => res.json())
  .then((data) => {
    console.log(data);
    name = data.username;
    id = data.id;
    appendMessage("You joined", false);
    socket.emit("new-user-private", room, name);
  })
  .catch((error) => {
    console.log(error);
  });

socket.on("private-message", (data) => {
  appendMessage(`${data.name}: ${data.message}`);
});

socket.on("user-private-connected", (name) => {
  appendMessage(`${name} connected`);
});

socket.on("user-disconnected", (name) => {
  appendMessage(`${name} disconnected`);
});

sendMsgBtn.addEventListener("click", (e) => {
  // e.preventDefault();
  const message = messageInput.value;
  appendMessage(`You: ${message}`);
  socket.emit("private-message", room, message);
  saveMessage(message);
  messageInput.value = "";
});

function appendMessage(message) {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageContainer.append(messageElement);
}

function saveMessage(message) {
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: message, room: room}),
  };
  fetch("/room/chatHistory", options)
    .catch((error) => {
      console.log(error);
    });
}
