//发送手机验证码相关设置
var AppKey = '8b306a0b59960ba18f108817fd51fde2';//手机验证码发送接口key
var send_host = 'http://v.juhe.cn/sms/send';//手机验证码发送接口地址
var tpl_id = '67010'; //验证码模板

//mongodb相关设置
var db_url = 'mongodb://localhost:27017';
var db_name = 'health_management';

//历史数据展示条数
var records_num = 30;

exports.AppKey = AppKey
exports.send_host = send_host
exports.tpl_id = tpl_id
exports.db_url = db_url
exports.db_name = db_name
exports.records_num = records_num

//需要验证是否登录的页面
exports.page_path = [
    '/static/index.html',
    '/static/blood.html',
    '/static/addRecord.html',
    '/static/addmedicalrecord.html',
    '/static/editmedicalrecord.html',
    '/static/medicalrecord.html'
]

//需要验证的接口
exports.api_path = [

]