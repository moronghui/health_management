var express = require("express");
var app = express();

app.use('/static', express.static('public'))


app.listen(4000, () => console.log('服务器正运行在4000端口上！'));
