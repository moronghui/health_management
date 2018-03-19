var md5 = require('js-md5');

exports.result = result;
exports.md5 = mymd5
exports.generate_token = generate_token

/**
 * 定义接口返回值格式
 * {'code':200,'msg':'ok','data':{'token':'123'}}
 * @return {[type]} [description]
 */
function result(code, msg, data, res) {
    var obj = {};
    obj.code = code;
    obj.msg = msg;
    obj.data = data;
    res.send(JSON.stringify(obj));
}

/**
 * md5加密
 * @param {*} text 
 */
function mymd5(text){
    return md5(text);
}

/**
 * 根据用户登录的手机号码和时间生成唯一的登陆凭证
 * @param {*} phone 
 */
function generate_token(phone){
    return mymd5(phone + (new Date()).toString());
}
