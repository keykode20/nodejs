const express = require('express');
const app = express();
const path = require('path');
const amqp = require('amqplib/callback_api');
const bodyParser = require('body-parser');
const multer = require('multer'); // v1.0.5
const upload = multer(); // for parsing multipart/form-data
const amqpUrl = "amqp://jfldddlv:ebyYr8y-HlyRi4wQOJjnyIvEahODNhGj@mosquito.rmq.cloudamqp.com/jfldddlv";
const queueName = "chat";
const mongo = require('mongodb');
const SSE = require("sse-node");

var Pusher = require('pusher');

var pusher = new Pusher({
  appId: '651155',
  key: 'faf88ac27bbf9a6165c3',
  secret: '6a8edce08441e89d9d2a',
  cluster: 'eu',
  encrypted: true
});

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";
var dbo;
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
    dbo = db.db("sassutti");
    dbo.createCollection("customers", function(err, res) {
      if (err) throw err;
      console.log("Collection created!");
//      db.close();
    });
});


app.use(express.static(path.join(__dirname, 'static')));

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
//app.use(express.static(path.join(__dirname, 'static')));
app.listen(1989);

var listOnMesg = new Array();

app.get("/",(req,res)=>{
  //res.render(__dirname+'/static/index.html',{message:listOnMesg.toString()});
  //,{message:listOnMesg.toString()}
  res.render('index');
});

app.get("/m",(req,res)=>{
  //,{message:listOnMesg.toString()}
  res.sendFile(path.join(__dirname+'/views/index.html'));
});

app.post("/message",function(req,res){
  var personWithMessage = { name: req.body.name , message: req.body.message };
  listOnMesg.push(personWithMessage);
  amqp.connect(amqpUrl,function(err,conn){
    conn.createChannel(function(err,ch){
      ch.assertQueue(queueName,{durable: false});
      ch.sendToQueue(queueName,Buffer.from(req.body.message));
    });
  });
/* recently added this is the ajax call*/
if(personWithMessage !== "" || personWithMessage !== null){
   dbo.collection("customers").insertOne(personWithMessage);
}

var messages = new Array();

dbo.collection("customers").find({}).toArray(function(err,result){
      result.forEach(function(element){
        var response = {name:element.name, message:element.message};
          messages.push(response);
  });
  res.send(messages);
  /*pusher.trigger('my-channel', 'my-event', {
    "message": personWithMessage
  });*/
});
});

app.get("/sse", (req, res) => {
    const client = SSE(req, res, {ping:100000});
    client.send("Hello world!",);
    client.onClose(() => console.log("Bye client!"));
});


app.post("/load",function(req,res){
  var messages = new Array();

  dbo.collection("customers").find({}).toArray(function(err,result){
        result.forEach(function(element){
          var response = {name:element.name, message:element.message};
            messages.push(response);
    });
    res.send(messages);
  });
});



amqp.connect(amqpUrl,function(err,conn){
  conn.createChannel(function(err,ch){
    ch.assertQueue(queueName,{durable: false});
    ch.consume(queueName,function(msg){
      console.log(" <- Received %s", msg.content.toString()); //I can see this in the logs
    },{noAck:true});
  });
});
