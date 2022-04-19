const messageList = document.querySelector("ul");
const messageForm = document.querySelector("form");
const socket = new WebSocket(`ws://${window.location.host}`);
//front와 back에서 메시지를 주고 받을 수 있다

//메시지 받기
socket.addEventListener("open", () => {
  console.log("Connected to Server ✅");
});

socket.addEventListener("message", message => {
  console.log("New message: ", message.data);
});

socket.addEventListener("close", () => {
  console.log("Disconnected from Server ❌");
});

function handleSubmit(event) {
  event.preventDefault();
  const input = messageForm.querySelector("input");
  socket.send(input.value); //server로 메시지 보내고
  input.value = ""; //보내지면 칸을 지운다
}

messageForm.addEventListener("submit", handleSubmit);
