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
app.set('view engine', 'pug');

var listOnMesg = new Array();

app.get("/",(req,res)=>{
  console.log(listOnMesg.toString());
  //res.render(__dirname+'/static/index.html',{message:listOnMesg.toString()});
  res.render('index',{message:listOnMesg.toString()});
});

app.get("/f",(req,res)=>{
  //console.log('before saving: '+listOnMesg.toString());
  //if(listOnMesg)dbo.collection("customers").insertOne(JSON.parse(listOnMesg.toString()));

    var obj = {
      message : JSON.stringify(listOnMesg),
    };
    console.log('e qui dentro? ' + JSON.stringify(listOnMesg));
    listOnMesg = new Array();
    console.log('/f obj -> ' + JSON.stringify(obj));

  if(obj.message !== ""){
    console.log('sono dentro ' + obj.message);
     dbo.collection("customers").insertOne(obj);
  }

 var result = dbo.collection("customers").find({}).toArray(function(err,result){
   console.log('sto per mandare la risposta');
   var messages = new Array();
   result.forEach(function(element){
        messages.push(element.message);
   });

   messages.forEach(function(ele){
      console.log('messages '+ ele);
   });

   res.render('index',{message:messages});
   console.log('mandato');
 });


   /*var messages = result.forEach(function(element){
       console.log('element: '+element);
   });

   console.log('populated messages: '+ messages);*/

 console.log("--->"+result);
 //console.log('tutti i dati : '+result);
 //console.log("all db : " + JSON.stringify(result.toString()));
});

app.get("/m",(req,res)=>{
  res.render('index',{message:listOnMesg.toString()});
});

app.post("/message",function(req,res){
  console.log("/message called succesfully :" + req.body.message);
  console.log("/message called succesfully :" + req.body.name);

  var personWithMessage = { name: req.body.name , message: req.body.message };
  console.log('from client ' + JSON.stringify(personWithMessage));

  listOnMesg.push(personWithMessage);
  amqp.connect(amqpUrl,function(err,conn){
    conn.createChannel(function(err,ch){
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
