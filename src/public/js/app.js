const socket = io();

const welcome = document.getElementById("welcome");
const form = welcome.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;
let roomName;

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li"); //메시지를 새로 만들어 보내준다
  li.innerText = message;
  ul.appendChild(li);
}

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#msg input");
  const value = input.value;
  socket.emit("new_message", input.value, roomName, () => {
    addMessage(`You: ${value}`);
  });
  input.value = "";
}

function handleNicknameSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#name input");
  socket.emit("nickname", input.value);
}

function showRoom() {
  welcome.hidden = true;
  room.hidden = false;
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`;
  const msgForm = room.querySelector("#msg");
  msgForm.addEventListener("submit", handleMessageSubmit);
  const nameForm = room.querySelector("#name");
  nameForm.addEventListener("submit", handleNicknameSubmit);
}

function handleRoomSubmit(event) {
  const roomNameInput = form.querySelector("#roomName");
  const nickNameInput = form.querySelector("#name");
  event.preventDefault();
  socket.emit("enter_room", roomNameInput.value, nickNameInput.value, showRoom);
  roomName = roomNameInput.value;
  roomNameInput.value = "";
  const changeNameInput = room.querySelector("#name input");
  changeNameInput.value = nickNameInput.value;
}

form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", (user, newCount) => {
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName} (${newCount})`;
  addMessage(`${user} joined`);
});

socket.on("bye", (left, newCount) => {
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName} (${newCount})`;
  addMessage(`${left} is left`);
});

socket.on("new_message", addMessage);

socket.on("room_change", rooms => {
  const roomList = welcome.querySelector("ul");
  roomList.innerHTML = "";
  if (rooms.length === 0) {
    return;
  }
  rooms.forEach(room => {
    const li = document.createElement("li");
    li.innerText = room;
    roomList.append(li);
  });
});
