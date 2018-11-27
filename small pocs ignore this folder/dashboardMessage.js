const express = require('express');
const app = express();
const path = require('path');
const amqp = require('amqplib/callback_api');
const amqpUrl = "amqp://jfldddlv:ebyYr8y-HlyRi4wQOJjnyIvEahODNhGj@mosquito.rmq.cloudamqp.com/jfldddlv";

app.set('view engine', 'pug');

var listOnMesg = new Array();


app.get('/',(req,res)=>{
  res.render('messageDashboard',{message:'miao'});
});

amqp.connect(amqpUrl,function(err,conn){
  conn.createChannel(function(err,ch){
    var q = 'Emilio';
    ch.assertQueue(q,{durable: false});
    console.log(" <- Waiting for messages in %s. To Exit press CTRL+C",q);
    ch.consume(q,function(msg){
      listOnMesg.push(msg.content.toString());
      console.log('-> list ->'+listOnMesg); //this is never shown
      console.log(" <- Received %s", msg.content.toString()); //I can see this in the logs
    },{noAck:true});
  });
});

app.get("/message",(req,res)=>{
  res.render('messageDashboard',{message:listOnMesg.toString()});
});


app.listen(3000);
