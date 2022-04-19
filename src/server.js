import express from "express";
import WebSocket from "ws";
import http from "http";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log(`Listening on http://localhost:3000`);

const server = http.createServer(app);

//현재 http, webSocket를 같은 서버 동시에 실행시키고 있다, 굳이 안해도됨
const wss = new WebSocket.Server({ server });

const sockets = [];

wss.on("connection", socket => {
  sockets.push(socket);
  console.log("Connected to Browser ✅");
  socket.on("close", () => console.log("Disconnected from the Browser ❌"));
  socket.on("message", message => {
    sockets.forEach(aSocket => aSocket.send(message.toString()));
  }); //서로 다른 브라우저에 같은 메시지를 보냈다
});

//지금 서로 다른 브라우저에서 소통을 할거다. 어떤 연결된 유저가 하는지 알려줘야함

server.listen(3000, handleListen);
