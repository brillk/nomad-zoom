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

setTimeout(() => {
  socket.send("hello from the browser!");
}, 10000);
