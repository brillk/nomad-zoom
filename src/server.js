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

function publicRooms() {
  const {
    sockets: {
      adapter: { sids, rooms },
    },
  } = io;
  const publicRooms = [];
  rooms.forEach((_, key) => {
    if (sids.get(key) === undefined) {
      publicRooms.push(key);
    }
  });
  return publicRooms;
}
//서로 다른 서버에 있는 사람들과 대화하기 위해선
// adapter를 써서 연결할수있다

/*
 요약: sids에는 개인방, rooms에는 개인방,공개방 다있음.
rooms가 sids를 포함한다 보면됨.
그래서 공개방만 얻고 싶을때는 rooms에서 sids를 빼면 됨
*/

io.on("connection", socket => {
  socket["nickname"] = "Ananimous";
  socket.onAny(event => {
    console.log(`Socket Event: ${event}`);
  });
  socket.on("enter_room", (roomName, nickname, done) => {
    socket["nickname"] = nickname;
    socket.join(roomName);
    done();
    socket.to(roomName).emit("welcome", socket.nickname);
    io.sockets.emit("room_change", publicRooms());
  });
  socket.on("disconnecting", () => {
    socket.rooms.forEach(room => socket.to(room).emit("bye", socket.nickname));
  });
  socket.on("disconnect", () => {
    io.sockets.emit("room_change", publicRooms());
  });

  socket.on("new_message", (msg, room, done) => {
    socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
    done();
  });
  socket.on("nickname", nickname => (socket["nickname"] = nickname));
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
