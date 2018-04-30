var db = require('./model/db.js');
var util = require('./util.js');
var config = require('./config.js');

exports.getReport = getReport;

/**
 * 生成健康报告
 * @param {string} phone 
 * @param {*} res 
 */
function getReport(phone, res) {
    //var types = ['weight', 'rate', 'blood', 'temperature', 'breathe', 'sports', 'drink', 'smoke'];

    //var type = types[0]
    getReportByTpye('weight', phone ,function(err, data){
        if (err) {
            util.result('104', '读取数据错误', null, res);
            return;
        }
        util.result('200', '获取数据成功', { data }, res);
    });
    
}

/**
 * 返回一个类型的健康报告 最近三十条（可配置）数据
 * @param {*} type 类型 ['weight', 'rate', 'blood', 'temperature', 'breathe', 'sports', 'drink', 'smoke']
 * @param {string} phone 
 */
function getReportByTpye(type, phone, callback) {
    db.find(type, {phone}, function(err,result){
        if (err) {
            callback(err, null);
            return;
        }
        switch (type) {
            case 'blood':
                callback(null, bloodReport(result));
                return;
            case 'weight':
                callback(null, weightReport(result));
                return;
            case 'rate':
                callback(null, rateReport(result));
                return;
            case 'temperature':
                callback(null, temperatureReport(result));
                return;
            case 'breath':
                callback(null, breathReport(result));
                return;
            case 'sports':
                callback(null, sportsReport(result));
                return;
            case 'drink':
                callback(null, drinkReport(result));
                return;
            case 'smoke':
                callback(null, smokeReport(result));
                return;
        }
    }, { 'date': -1, 'time': -1 }, config.records_num)
}

/**
 * 生成身高体重报告
 * @param {} result 
 * '您最近一次记录的BMI指数为{{22}}，属于{{正常等级}}，最近三十次平均BMI指数为{{22}},属于{{正常等级}}。{{现在输入正常输入，请继续保持}}'
 */
function weightReport(result){
    var BMIs = [];
    for (let i = 0; i < result.length; i++) {
        var height = (result[i].data.height)/100;
        BMIs[i] = (result[i].data.weight / (height * height)).toFixed(2);
    }
    if(BMIs.length < 1){
        return {type: 'weight', content: '您还没有记录身高体重信息，请先添加记录。添加记录越多，生成报告越准确！'};
    }
    //最近一次记录
    var latest = getWeightDegree(BMIs[0]);
    var total = 0;
    for(let i = 0; i < BMIs.length; i++){
        total += Number(BMIs[i]);
    }
    var aver = (total/BMIs.length).toFixed(2);
    var aver_degree = (getWeightDegree(aver)).la_degress;
    var content = '您最近一次记录的BMI指数为'+ BMIs[0] +'，属于'+ latest.la_degress +'; 最近三十次平均BMI指数为' + aver + ',属于'+ aver_degree +'。' + latest.tip;
    return {type: 'weight', content: content}
}

/**
 * 根据BMI值返回健康等级
 * @param {*} bmi 
 */
function getWeightDegree(bmi){
    var la_degress = '';
    var tip ='';
    if(bmi <= 18.5){
        la_degress = '偏瘦等级';
        tip = '您身体属于偏瘦，请注意注意饮食，适当增加体重!';
    }else if(bmi > 18.5 && bmi < 24){
        la_degress = '正常等级';
        tip = '您的身高体重指数正常，请继续保持!';
    }else if(bmi >= 24 && bmi < 28){
        la_degress = '偏胖等级';
        tip = '您身体属于偏胖，请注意饮食，加强锻炼，适当减少体重!';
    }else if(bmi >= 28 && bmi < 40){
        la_degress = '重度肥胖等级';
        tip = '您身体属于重度肥胖，请注意饮食，加强锻炼，有意识地减少体重!';
    }else if(bmi >= 40){
        la_degress = '极重度肥胖等级';
        tip = '您身体属于极重度肥胖，请注意饮食，加强锻炼，有意识地减少体重!';
    }
    return {la_degress, tip}
}