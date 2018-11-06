const EventEmitter = require('events');

const emitter = new EventEmitter();

//Register a listerner
//order is important in this case
emitter.on('messageLogged',(arg) =>{
   console.log('Listener called',arg); 
});

emitter.emit('messageLogged', {id:1, url:"http://"});