const messageList = document.querySelector("ul");
const messageForm = document.querySelector("#message");
const nickForm = document.querySelector("#nick");
const socket = new WebSocket(`ws://${window.location.host}`);
//front와 back에서 메시지를 주고 받을 수 있다

function makeMessage(type, payload) {
  const msg = { type, payload };
  return JSON.stringify(msg);
}

//메시지 받기
socket.addEventListener("open", () => {
  console.log("Connected to Server ✅");
});

socket.addEventListener("message", message => {
  const li = document.createElement("li");
  li.innerText = message.data;
  messageList.append(li);
});

socket.addEventListener("close", () => {
  console.log("Disconnected from Server ❌");
});

function handleSubmit(event) {
  event.preventDefault();
  const input = messageForm.querySelector("input");
  socket.send(makeMessage("new_message", input.value)); //server로 메시지 보내고
  input.value = ""; //보내지면 칸을 지운다
}

function handleNickSubmit(event) {
  event.preventDefault();
  const input = nickForm.querySelector("input");
  socket.send(makeMessage("nickname", input.value));
}

messageForm.addEventListener("submit", handleSubmit);
nickForm.addEventListener("submit", handleNickSubmit);
