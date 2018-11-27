const http = require('http');

const server = http.createServer((req,res)=>{
    if(req.url === '/'){
        res.write('hello world');
        res.end();
    }
    if(req.url === '/api/courses'){
        res.write(JSON.stringify([1,2,3]));
        res.end();
    }
});
/*
server.on('connection',(socket) =>{
   console.log('new connection...'); 
});
*/
//a server is an event emitter
server.listen(3000);

console.log('listening on port 3000...');

