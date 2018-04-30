var express = require("express");
var session = require("express-session");
var bodyParser = require('body-parser');
var captcha = require("./api/captcha.js");
var config = require('./api/config.js');
var util = require('./api/util.js');
var record = require('./api/record.js');
var report = require('./api/report.js');
var app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(session({
    secret: 'health',
    name: 'captcha',   //这里的name值得是cookie的name，默认cookie的name是：connect.sid
    cookie: { maxAge: 1000*60*60 },  //设置maxAge是80000ms，即80s后session和相应的cookie失效过期
    resave: false,
    saveUninitialized: true,
}))

/** 未登录则跳转到登录页面，无效的token则直接返回 */
app.use(function(req, res, next){
    var url = req.originalUrl;//  /static/index.html?v=23
    var pathname = url.split('?')[0];  // /static/login.html
    if (config.page_path.indexOf(pathname) >= 0 && !req.session.token) {//在配置文件中配置需要做判断的页面
        return res.redirect('/static/login.html');
    } else if (config.api_path.indexOf(pathname) >= 0 && req.body.token != req.session.token){
        util.result('100', 'invalid token', null, res);
    }else{
        next();
    }
})

app.use('/static', express.static('public'))



/**
 * 生成图形验证码
 */
app.get('/api/getCode', (req, res) => {
    captcha.getCode(req, res);
});

/**
 * 验证图形验证码是否正确
 */
app.get('/api/verCode', (req, res) => {
    var code = req.query.code;
    captcha.verCode(req, res, code);
});

/**
 * 验证图形验证码是否正确
 */
app.post('/api/sendCaptcha', (req, res) => {
    var phone = req.body.phone;
    var token = req.body.token;
    captcha.sendCaptcha(req, res, phone, token);
});

/**
 * 验证手机验证码是否正确，正确则登陆成功
 */
app.post('/api/vercaptcha', (req, res) =>{
    var phone = req.body.phone;
    var captchacode = req.body.captcha;
    captcha.vercaptcha(req, res, captchacode, phone);
});

/**
 * 设置密码
 */
app.post('/api/setpassword', (req, res) => {
    var phone = req.body.phone;
    var captchacode = req.body.captcha;
    var password = req.body.password;
    captcha.setpassword(req, res, captchacode, phone, password);
});

/**
 * 通过密码登陆
 */
app.get('/api/login', (req, res) => {
    var phone = req.query.phone;
    var password = req.query.password;
    captcha.login(req, res, phone, password);
})

/**
 * 添加一条健康记录
 */
app.post('/api/addRecord', (req, res) => {
    var phone = req.body.phone;
    var type = req.body.type;//记录类别，如身高、体重
    var date = req.body.date;//记录日期
    var time = req.body.time;//记录时间
    var data = req.body.data;//对象类型，记录数据，不同类别信息属性不同
    record.addRecord(phone, type, date, time, data, res);
})

/**
 * 获取历史数据
 */
app.post('/api/getRecords', (req, res) => {
    var phone = req.body.phone;
    var type = req.body.type;//记录类别，如身高、体重
    record.getRecords(phone, type, res);
})

/**
 * 获取最近一条记录
 */
app.post('/api/latestRecord', (req, res) => {
    var phone = req.body.phone;
    var type = req.body.type;//记录类别，如身高、体重
    record.latestRecord(phone, type, res);
})

/**
 * 根据id获取一条记录
 */
app.post('/api/getRecordById', (req, res) => {
    var id = req.body.id;
    var type = req.body.type;//记录类别，如身高、体重
    record.getRecordById(type, id, res);
})

/**
 * 根据id更新医疗记录
 */
app.post('/api/updateById', (req, res) => {
    var phone = req.body.phone;
    var type = req.body.type;//记录类别，如身高、体重
    var date = req.body.date;//记录日期
    var time = req.body.time;//记录时间
    var data = req.body.data;//对象类型，记录数据，不同类别信息属性不同
    var id = req.body.id; //id
    record.updateById(phone, type, id, date, time, data, res);
})

/**
 * 获取健康报告
 */
app.post('/api/getReport', (req, res) => {
    var phone = req.body.phone;
    report.getReport(phone, res);
})

app.listen(4000, () => console.log('服务器正运行在4000端口上！'));

