const amqp = require('amqplib/callback_api');
const amqpUrl = "amqp://jfldddlv:ebyYr8y-HlyRi4wQOJjnyIvEahODNhGj@mosquito.rmq.cloudamqp.com/jfldddlv";

amqp.connect(amqpUrl,function(err,conn){
  conn.createChannel(function(err,ch){
    var q = 'CloudAMQP';
    ch.assertQueue(q,{durable: false});
    console.log(" <- Waiting for messages in %s. To Exit press CTRL+C",q);
    ch.consume(q,function(msg){
      console.log(" <- Received %s", msg.content.toString());
    },{noAck:true});
  });
});


amqp.connect(amqpUrl,function(err,conn){
  conn.createChannel(function(err,ch){
    var q = 'Emilio';
    ch.assertQueue(q,{durable: false});
    console.log(" <- Waiting for messages in %s. To Exit press CTRL+C",q);
    ch.consume(q,function(msg){
      console.log(msg);
      console.log(" <- Received %s", msg.content.toString());
    },{noAck:true});
  });
});
