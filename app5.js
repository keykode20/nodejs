const EventEmitter = require('events');

const emitter = new EventEmitter();

//Register a listerner
//order is important in this case
emitter.on('messageLogged',function(){
   console.log('Listener called'); 
});

emitter.emit('messageLogged');