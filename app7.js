const express = require('express');
const app = express();
const path = require('path');
const amqp = require('amqplib/callback_api');
var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data
const mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";
MongoClient.connect(url, function(err, db) {
  if (err) throw err;
    dbo = db.db("CVContacts");
    dbo.createCollection("contacts", function(err, res) {
      if (err) throw err;
      console.log("Collection created!");
//      db.close();
    });
});





app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
const amqpUrl = "amqp://jfldddlv:ebyYr8y-HlyRi4wQOJjnyIvEahODNhGj@mosquito.rmq.cloudamqp.com/jfldddlv";

app.use(express.static(path.join(__dirname, 'static')));
app.use(express.static(path.join(__dirname, 'backoffice')));

app.get("/",(req,res)=>{
    res.sendFile(__dirname+'/static/index.html');
});

app.post('/sendMessage', function(req,res){
  console.log(req.body);
  dbo.collection('contacts').insertOne(req.body);
  res.send('ok');
});

app.post("/test",(req,res)=>{

  console.log(req.body.message);
  res.sendFile(__dirname+'/static/index.html');

  amqp.connect(amqpUrl,function(err,conn){
    conn.createChannel(function(err,ch){
      var q = 'Emilio';
      var msg = 'Contact sent!';
      ch.assertQueue(q,{durable: false});
      ch.sendToQueue(q,Buffer.from(req.body.message));
      /*setInterval(function(){
        ch.sendToQueue(q,Buffer.from(msg));
      },2000);*/
    });
  });
});

app.get('/backoffice',(req,res)=>{
  res.sendFile(__dirname+'/backoffice/index.html');
});

app.post('/loadPage',(req,res)=>{
  var messages = new Array();
  dbo.collection("contacts").find({}).toArray(function(err,result){
        result.forEach(function(element){
          console.log(element);
          messages.push(element);
          //  messages.push(response);
    });
    res.send(messages);
  });
});

app.listen(80);
