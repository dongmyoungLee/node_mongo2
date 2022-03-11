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
  // db 의 post 라는 collection 에서 모든 데이터 가져오기
  db.collection("post")
    .find()
    .toArray((error, result) => {
      res.render("list.ejs", { posts: result });
    });
});

app.post("/add", (req, res) => {
  // counter collection 에서 auto_increment 역할
  db.collection("counter").findOne({ name: "게시물갯수" }, (err, result) => {
    let total = result.totalPost;

    // post collection 에 데이터 삽입. 하지만 totalPost가 업데이트되지 않아 id가 겹쳐서 삽입안됨.
    db.collection("post").insertOne(
      { _id: total + 1, title: req.body.title, date: req.body.date },
      (error, result) => {
        // counter collection 에서 totalPost update 해줌 -> 그러니 이제 삽입가능.
        db.collection("counter").updateOne(
          { name: "게시물갯수" },
          { $inc: { totalPost: 1 } },
          (err, result) => {
            if (err) return console.log(err);
          }
        );
      }
    );
  });
  res.send("회원가입완료");
});

app.delete("/delete", (req, res) => {
  req.body._id = parseInt(req.body._id);
  db.collection("post").deleteOne(req.body, (err, result) => {
    console.log("삭제완료");
    res.status(200).send({ message: "성공" });
  });
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

  - 거의 모든 곳에 사용할 수 있어 범용적입니다.  

  - 구조화된 데이터를 저장하기 가장 좋습니다. 

  - 보통 SQL이라는 언어를 이용해 데이터를 출력 입력합니다. 

  - "이 열엔 숫자가 들어옵니다~"라고 스키마를 미리 정의하기 때문에 관리가 쉽습니다. 

  - 구조화된 데이터 덕분에 원하는 데이터 뽑기도 쉽습니다.  

  - 트랜잭션 롤백 이런 기능을 이용해 데이터의 무결성을 보존하기 쉽기 때문에 금융, 거래 서비스에 필수입니다. 

  Nosql
  - Dynamo, Orecla Nosql, MongoDB, Redis, Cassandra
  - Object 자료형으로 입출력 가능함.
  - 쉽고 자유로운 저장 가능

  종류

  - Key-value 모델 : Object, JSON 자료형 형식으로 데이터를 쉽게쉽게 저장, 출력이 가능합니다. 가장 심플함

  - Document 모델 : 테이블 대신 Collection이라는 문서 기반으로 데이터를 분류하고 저장합니다. 테이블보다는 훨씬 유연합니다. 

  (우리가 사용하고 있는 MongoDB도 Key-value, Document 모델 저장방식을 차용하고 있습니다)

  - Graph 모델 : 데이터를 노드의 형태로 저장하고 노드간의 흐름 또는 관계를 저장할 수 있습니다. 

  - Wide-column 모델 : 한 행마다 각각 다른 수, 다른 종류의 열을 가질 수 있습니다. (스키마가 자유로움) 

  특징

  1. Scaling이 쉽다는 장점이 있다. 

  찰나의 순간에 대량의 데이터를 저장해야한다면 어떻게해야할까? 

  기존 올드한 관계형 데이터베이스는 확장이 매우 어렵습니다. 보통 scale up 이라는 방법으로 서버의 성능을 키워야합니다. 

  하지만 대부분의 NoSQL 데이터베이스는 scale out이라는 방법으로 데이터를 분산저장하는 걸 기본적으로 지원합니다. 

  확정 걱정할 필요없이 쉽게 쉽게 데이터 입출력에만 신경쓸 수 있는 것이죠. 

  그래서 대량의 데이터를 빠르게 입출력해야한다면 NoSQL이 제격이다. 

  (관계형 데이터베이스도 요즘은 분산저장 대충 잘힌다)

 

2. 대부분 다루기가 쉽습니다. 

SQL 이라는 언어를 새로 배우지 않아도 데이터를 쉽게 입출력할 수 있습니다. 

자바스크립트 object{} 자료형 다루듯이 데이터를 입출력할 수 있으니 사용자에게 매우 편리하죠. 


3. 대부분 스키마 정의 없이도 쉽게 쓸 수 있습니다. (이 열의 데이터는 정수입니다~ 라고 표현하는 짓거리 안해도 됨)

장점이자 단점일 수 있습니다. 그래서 MongoDB에선 스키마를 미리 정의하기 위한 Mongoose같은 라이브러리를 추가해서 사용하기도 합니다. 

 
4.  NoSQL 데이터베이스는 기본적으로 SQL에서의 JOIN 연산을 적용하는게 기본적으로 어렵습니다. 

서버 단에서 JOIN 연산을 쉽게 처리해주는 라이브러리를 이용합니다.

ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ

두 데이터베이스가 공존하는 이유는 바로 각각의 명확한 장점 때문입니다. 

정규화된 데이터와 안정성이 필요하다면 관계형 데이터베이스를 사용합니다. 

금융서비스를 만든다, 은행 전산시스템을 만든다면 당연히 안정적인 관계형이 최고입니다.


하지만 일초에 수백만개의 데이터 입출력 요청이들어오는 SNS 서비스를 만들 때,

뭔가 서비스의 변경사항이 잦아서 쉽고 유연하게 데이터를 저장하고 싶으면 NoSQL을 사용합니다. 

실제로 Facebook은 이런 대량의 데이터를 저장하기 위해 HBase 데이터베이스를 이용해 분산저장합니다. 

ㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡㅡ


*/
