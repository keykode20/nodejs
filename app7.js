const express = require('express');
const app = express();
const path = require('path');
const amqp = require('amqplib/callback_api');
var bodyParser = require('body-parser');
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
const amqpUrl = "amqp://jfldddlv:ebyYr8y-HlyRi4wQOJjnyIvEahODNhGj@mosquito.rmq.cloudamqp.com/jfldddlv";

app.use(express.static(path.join(__dirname, 'static')));

app.get("/",(req,res)=>{
    res.sendFile(__dirname+'/static/index.html');
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


app.listen(80);
