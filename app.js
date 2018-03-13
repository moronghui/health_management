var express = require("express");
var app = express();

app.use('/static', express.static('public'))


app.listen(80, () => console.log('服务器正运行在80端口上！'));