const amqp = require('amqplib/callback_api');
const amqpUrl = "amqp://jfldddlv:ebyYr8y-HlyRi4wQOJjnyIvEahODNhGj@mosquito.rmq.cloudamqp.com/jfldddlv";

amqp.connect(amqpUrl,function(err,conn){
  conn.createChannel(function(err,ch){
    var q = 'Emilio';
    var msg = 'this message is from Emilio!';
    ch.assertQueue(q,{durable: false});
    setInterval(function(){
      ch.sendToQueue(q,Buffer.from(msg));
    },2000);
  });
});

amqp.connect(amqpUrl,function(err,conn){
  conn.createChannel(function(err,ch){
    var q = 'CloudAMQP';
    var msg = 'this message is from CloudAMQP!';
    ch.assertQueue(q,{durable: false});
    setInterval(function(){
      ch.sendToQueue(q,Buffer.from(msg));
    },2000);
  });
});
