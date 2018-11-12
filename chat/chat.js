const express = require('express');
const app = express();
const path = require('path');
const amqp = require('amqplib/callback_api');
const bodyParser = require('body-parser');
const multer = require('multer'); // v1.0.5
const upload = multer(); // for parsing multipart/form-data
const amqpUrl = "amqp://jfldddlv:ebyYr8y-HlyRi4wQOJjnyIvEahODNhGj@mosquito.rmq.cloudamqp.com/jfldddlv";
const queueName = "chat";
app.use(express.static(path.join(__dirname, 'static')));

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
//app.use(express.static(path.join(__dirname, 'static')));
app.listen(1989);
app.set('view engine', 'pug');

var listOnMesg = new Array();

app.get("/",(req,res)=>{
  console.log(listOnMesg.toString());
  //res.render(__dirname+'/static/index.html',{message:listOnMesg.toString()});
  res.render('index',{message:listOnMesg.toString()});
});

app.get("/m",(req,res)=>{
  res.render('index',{message:listOnMesg.toString()});
});

app.post("/message",function(req,res){
  console.log("/message called succesfully");
  listOnMesg.push(req.body.message);
  amqp.connect(amqpUrl,function(err,conn){
    conn.createChannel(function(err,ch){
      var msg = 'Contact sent!';
      ch.assertQueue(queueName,{durable: false});
      ch.sendToQueue(queueName,Buffer.from(req.body.message));
    });
  });
  res.send(listOnMesg);
});

amqp.connect(amqpUrl,function(err,conn){
  conn.createChannel(function(err,ch){
    ch.assertQueue(queueName,{durable: false});
    console.log(" <- Waiting for messages in %s. To Exit press CTRL+C",queueName);
    ch.consume(queueName,function(msg){
      //listOnMesg.push(msg.content.toString());
      console.log('-> list ->'+listOnMesg); //this is never shown
      console.log(" <- Received %s", msg.content.toString()); //I can see this in the logs
    },{noAck:true});
  });
});