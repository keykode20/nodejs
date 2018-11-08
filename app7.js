const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, 'static')));

app.get("/",(req,res)=>{
    res.sendFile(__dirname+'/static/index.html');
});

app.listen(80);
