import express from "express";
import SocketIO from "socket.io";
import http from "http";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const server = http.createServer(app);

//현재 http, webSocket를 같은 서버 동시에 실행시키고 있다, 굳이 안해도됨
const io = SocketIO(server);
/*
socket.io를 쓸떄는 프론트랑 백엔드 둘다 선언해줘야 한다
 */

io.on("connection", socket => {
  socket.onAny(event => {
    console.log(`Socket Event: ${event}`);
  });
  socket.on("enter_room", (roomName, done) => {
    socket.join(roomName);
    done();
    socket.to(roomName).emit("welcome");
  });
  socket.on("disconnecting", () => {
    socket.rooms.forEach(room => socket.to(room).emit("bye"));
  });
  socket.on("new_message", (msg, room, done) => {
    socket.to(room).emit("new_message", msg);
    done();
  });
});
/*
const sockets = [];
const wss = new WebSocket.Server({ server });

wss.on("connection", socket => {
  sockets.push(socket);
  socket["nickname"] = "Ananimous"; //만약 비로그인자가 왔을때 이 닉네임을 붙여줌
  //console.log("Connected to Browser ✅");
  //socket.on("close", () => console.log("Disconnected from the Browser ❌"));
  socket.on("message", msg => {
    const message = JSON.parse(msg);
    switch (message.type) {
      case "new_message":
        sockets.forEach(aSocket =>
          aSocket.send(`${socket.nickname}: ${message.payload}`)
        );
        break;
      case "nickname":
        socket["nickname"] = message.payload;
        break;
    }
  }); //서로 다른 브라우저에 같은 메시지를 보냈다
});

지금 보내는 문자가 닉네임인지 그냥 메시지인지 구별을 해줘야 한다
json.stringify and parse

지금 서로 다른 브라우저에서 소통을 할거다. 어떤 연결된 유저가 하는지 알려줘야함
 */

const handleListen = () => console.log(`Listening on http://localhost:3000`);

server.listen(3000, handleListen);
