var svgCaptcha = require("svg-captcha");
var request = require('request');
var util = require('./util.js');
var config = require('./config.js');
var db = require('./model/db.js');

exports.getCode = getCode;
exports.verCode = verCode;
exports.sendCaptcha = sendCaptcha;
exports.vercaptcha = vercaptcha;
exports.setpassword = setpassword;
exports.login = login;

/**
 * 生成图形验证码
 * @param {*} req 
 * @param {*} res 
 */
function getCode(req, res) {
    var codeConfig = {
        size: 4, //验证码长度
        ignoreChars: '', //验证码字符中排除的字符
        noise: 5, //干扰线条的数量
        color: true,
        height: 50,
        width: 150
    }
    var captcha = svgCaptcha.createMathExpr(codeConfig);
    req.session.captcha = captcha.text;
    res.type('svg');
    res.status(200).send(captcha.data);
}

/**
 * 验证图形验证码是否正确
 * @param {*} code 
 * @param {*} res 
 * @return {string} code 200 正确; 201 错误 
 */
function verCode(req, res, code) {
    console.log(req.session.captcha);
    if (req.session.captcha == code) {
        util.result('200', '正确', null, res);
    }else{
        util.result('201', '错误', null, res);
    }
}

/**
 * 发送手机验证码
 * @param {*} req 
 * @param {*} res 
 */
function sendCaptcha(req, res, phone, token){
    /**验证token是否合法 */
    if (token != util.md5(util.md5(phone))) {
        return;
    }
    var tpl_value = Math.floor(Math.random() * 10000);//随机生成手机验证码
    req.session.phonecode = tpl_value;
    var url = config.send_host + '?mobile=' + phone + '&tpl_id=' + config.tpl_id + '&tpl_value=' + encodeURIComponent('#code#='+tpl_value)+'&key='+config.AppKey;
    request(url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            body = JSON.parse(body);
            send_callback(body.error_code);
            return;
        }
        send_callback(1);
    })
    function send_callback(error_code) {
        if (error_code == '0') {
            util.result('200', '发送成功', null, res);
        }else{
            util.result('201', '发送失败', null, res)
        }
    }
}

/**
 * 验证手机验证码是否正确，正确则登陆成功
 * @param {*} req 
 * @param {*} res 
 * @param {*} captcha 
 * @param {*} phone 
 */
function vercaptcha(req, res, captcha, phone){
    if (captcha == req.session.phonecode) {
        var token = util.generate_token(phone);
        req.session.token = token;
        util.result('200', '验证正确', {token}, res)
    }
    else{
        util.result('201', '验证错误', null, res)
    }
}

/**
 * 设置密码
 * @param {*} req 
 * @param {*} res 
 * @param {*} captchacode 
 * @param {*} phone 
 * @param {*} password 
 */
function setpassword(req, res, captcha, phone, password){
    if (captcha == req.session.phonecode) {
        db.find('password', {phone:phone}, function(err, result) {
            if (err) {
                util.result('104', '读取数据错误', null, res);
                return;
            }
            if (result.length > 0) {
                db.updateOne('password', {
                    phone: phone
                }, {
                    password: util.md5(password)
                }, function (err, result) {
                    if (err) {
                        util.result('104', '插入数据错误', null, res);
                        return;
                    }
                    util.result('200', '设置成功', null, res);
                })
            }else{
                db.insertOne('password',{
                    phone: phone,
                    password: util.md5(password)
                },function(err, result){
                    if (err) {
                        util.result('104', '插入数据错误', null, res);
                        return;
                    }
                    util.result('200', '设置成功', null, res);
                })
            }
        })
    }
    else {
        util.result('201', '验证错误', null, res)
    }
}

/**
 * 手机密码登陆
 */
function login(req, res, phone, password) {
    db.find('password', { phone: phone }, function (err, result) {
        if (err) {
            util.result('104', '读取数据错误', null, res);
            return;
        }
        if (result.length > 0 ) {
            var obj= result[0];
            if (obj.password == util.md5(password)) {
                var token = util.generate_token(phone);
                req.session.token = token;
                util.result('200', '登陆成功', {token}, res);
            }else{
                util.result('201', '密码错误', null, res);
            }
        }else{
            util.result('202', '该用户不存在', null, res);
        }
    })
}