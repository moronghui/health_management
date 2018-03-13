var express = require("express");
var app = express();

app.get('/login',(req, res) => {
    res.send('login');
})

app.listen(3000,'127.0.0.1',() => console.log('服务器正运行在3000端口上！'));