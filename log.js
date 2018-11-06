const EventEmitter = require('events');
const emitter = new EventEmitter();
var testExport = "test";

class Logger extends EventEmitter{
   log(message){
    console.log(message);
       this.emit('messageLogged',{id:1,url:"https://"});
   } 
    
}


//adding a method called log in the export object
module.exports = Logger;

module.exports.test = testExport;
