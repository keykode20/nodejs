const EventEmitter = require('events');
const Logger = require('./log');
const logger = new Logger();
//Register a listerner
//order is important in this case
logger.on('messageLogged',(arg) =>{
   console.log('Listener called',arg); 
});

logger.log('message');