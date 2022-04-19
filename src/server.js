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

function handleConnection(socket) {
  console.log(socket);
}

wss.on("connection", handleConnection);

server.listen(3000, handleListen);
