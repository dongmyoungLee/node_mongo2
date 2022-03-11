const express = require("express");
const app = express();
const bodyParser = require("body-parser");

let db;

const MongoClient = require("mongodb").MongoClient;
MongoClient.connect(
  "mongodb+srv://pajang1515:d1e0934c@cluster0.f1d2c.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
  (error, client) => {
    if (error) return console.log(error);

    db = client.db("todoapp");

    app.listen(8080, () => {
      console.log("listening on 8080");
    });
  }
);
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/pet", (req, res) => {
  res.send("펫 용품을 쇼핑할 수 있는 페이지 입니다.");
});

app.get("/beauty", (req, res) => {
  res.send("뷰티 용품을 쇼핑할 수 있는 페이지 입니다.");
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/write", (req, res) => {
  res.sendFile(__dirname + "/write.html");
});

app.get("/list", (req, res) => {
  res.render("list.ejs");
});

app.post("/add", (req, res) => {
  db.collection("post").insertOne(
    { title: req.body.title, date: req.body.date },
    (error, result) => {
      console.log("폼 데이터 저장완료");
    }
  );

  res.send("회원가입완료");
});

/*
  rest API 6원칙

  1. Uniform interface

  - 하나의 자료는 하나의 URL로
  - URL 하나를 알면 둘을 알 수 있어야함.
  - 요청과 으답은 정보가 충분히 들어가 있어야 함.

  - URL 명사로 작성
  - 하위 문서 나타낼 땐 / 
  - 파일확장자 쓰지말기.
  - 띄어쓰기 대신 대시 이용
  - 자료하나당 하나의 URL

  
  2. Client-Server 역할 구분
  
  - 브라우저는 요청만 할 뿐
  - 서버는 응답만 할 뿐

  3. Stateless

  - 요청1과 요청2는 의존성이 없어야함.

  4. Cacheable

  - 서버에서 보내주는 정보들은 캐싱이 가능해야함.
  - 캐싱을 위한 버전같은것도 관리 잘해야함.

  5. Layered System

  6. Code on Demand


  관계형 DB

  - 엑셀처럼 칸이 나뉘어져 있음 ex) Mysql, MariaDB, Oracle, MSsql Server
  - 3차원 저장 힘듬. SQL 문으로 이루어짐

  Nosql
  - Dynamo, Orecla Nosql, MongoDB, Redis, Cassandra
  - Object 자료형으로 입출력 가능함.
  - 쉽고 자유로운 저장 가능


*/
