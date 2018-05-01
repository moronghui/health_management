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
    //var types = ['weight', 'rate', 'blood', 'temperature', 'breath', 'sports', 'drink', 'smoke'];

    var types = ['weight', 'rate', 'blood', 'temperature', 'breath'];
    var dataArr = [];
    addReport( types[0]);

    function addReport(type){
        getReportByTpye(type, phone ,function(err, data){
            if (err) {
                util.result('104', '读取数据错误', null, res);
                return;
            }
            dataArr.push(data);
            types.splice(0,1);
            if(types.length > 0){
                addReport(types[0]);
            }else{
                util.result('200', '获取数据成功', { data : dataArr }, res);
            }
            
        });
    }
    
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
 * 获取呼吸等级
 * @param {*} breath 
 */
function getBreatheDegree(breath){
    var  degree = '';
    var  tip = '';
    if(breath < 16){
        degree = '呼吸过慢';
        tip = '您的呼吸过慢，请检测多次已确定，同时请咨询相关医生';
    }else if( breath > 20){
        degree = '呼吸过快';
        tip = '您的呼吸过快，请检测多次已确定，同时请咨询相关医生';
    }else{
        degree = '呼吸正常';
        tip = '您的呼吸正常';
    }
    return {degree, tip};
}

/**
 * 生成呼吸健康报告
 */
function breathReport(result){
    if(result.length < 1){
        return {type: 'breath', content: '您还没有记录呼吸信息，请先添加记录。添加记录越多，生成报告越准确！'};
    }
    var total = 0;
    for(let i = 0; i < result.length; i++){
        total += Number(result[i].data.breath);
    }
    var aver = (total/result.length).toFixed(2);
    var latest = result[0].data.breath;
    var content = '您最近一次记录的呼吸指数为'+ latest +'，属于'+ getBreatheDegree(latest).degree +'; 最近三十次平均BMI指数为' + aver + ',属于'+ getBreatheDegree(aver).degree +'。' + getBreatheDegree(latest).tip;
    return {type: 'breath', content: content}
}

/**
 * 获取体温等级
 * @param {*} temperature 
 */
function getTemperatureDegree(temperature){
    var  degree = '';
    var  tip = '';
    if(temperature < 36.1){
        degree = '体温过低';
        tip = '您的体温过低，请检测多次已确定，同时请咨询相关医生';
    }else if( temperature > 37){
        degree = '体温过高';
        tip = '您的体温过高，请检测多次已确定，同时请咨询相关医生';
    }else{
        degree = '体温正常';
        tip = '您的体温正常';
    }
    return {degree, tip};
}

/**
 * 生成体温健康报告
 */
function temperatureReport(result){
    if(result.length < 1){
        return {type: 'temperature', content: '您还没有记录体温信息，请先添加记录。添加记录越多，生成报告越准确！'};
    }
    var total = 0;
    for(let i = 0; i < result.length; i++){
        total += Number(result[i].data.temperature);
    }
    var aver = (total/result.length).toFixed(2);
    var latest = result[0].data.temperature;
    var content = '您最近一次记录的体温指数为'+ latest +'，属于'+ getTemperatureDegree(latest).degree +'; 最近三十次平均BMI指数为' + aver + ',属于'+ getTemperatureDegree(aver).degree +'。' + getTemperatureDegree(latest).tip;
    return {type: 'temperature', content: content}
}

/**
 * 返回血压等级
 * @param {*} data 
 */
function getBloodDegress(data){
    var  degree = '';
    var  tip = '';
    if(data.height_blood >= 140 || data.low_blood >= 90 ){
        degree = '高血压';
        tip = '您的血压偏高，请注意饮食，引起重视，同时请咨询相关医生';
    }else if( data.height_blood < 90 || data.low_blood < 60){
        degree = '低血压';
        tip = '您的血压偏低，请引起重视，同时请咨询相关医生';
    }else{
        degree = '血压正常';
        tip = '您的血压正常';
    }
    return {degree, tip};
}

/**
 * 获取血压报告
 * @param {*} result 
 */
function bloodReport(result){
    if(result.length < 1){
        return {type: 'blood', content: '您还没有记录血压信息，请先添加记录。添加记录越多，生成报告越准确！'};
    }
    var total_height = 0;
    var total_low = 0;
    for(let i = 0; i < result.length; i++){
        total_height += Number(result[i].data.height_blood);
        total_low += Number(result[i].data.low_blood);
    }
    var aver_height = (total_height/result.length).toFixed(2);
    var aver_low = (total_low/result.length).toFixed(2);
    var aver_data = {height_blood: aver_height, low_blood: aver_low};
    var latest = result[0].data;
    var content = '您最近一次记录的血压指数为'+ latest.height_blood + '/' + latest.low_blood +'，属于'+ getBloodDegress(latest).degree +'; 最近三十次平均BMI指数为' + aver_height + '/' + aver_low + ',属于'+ getBloodDegress(aver_data).degree +'。' + getBloodDegress(latest).tip;
    return {type: 'blood', content: content}
}

/**
 * 获取心率等级
 * @param {*} rate 
 */
function getRateDegree(rate){
    var  degree = '';
    var  tip = '';
    if(rate < 60){
        degree = '心动过缓';
        tip = '您的心率过慢，请检测多次已确定，同时请咨询相关医生';
    }else if( rate > 100){
        degree = '心动过速';
        tip = '您的心率过快，请检测多次已确定，同时请咨询相关医生';
    }else{
        degree = '心率正常';
        tip = '您的心率正常';
    }
    return {degree, tip};
}

/**
 * 生成心率健康报告
 */
function rateReport(result){
    if(result.length < 1){
        return {type: 'rate', content: '您还没有记录心率信息，请先添加记录。添加记录越多，生成报告越准确！'};
    }
    var total = 0;
    for(let i = 0; i < result.length; i++){
        total += Number(result[i].data.rate);
    }
    var aver = (total/result.length).toFixed(2);
    var latest = result[0].data.rate;
    var content = '您最近一次记录的心率指数为'+ latest +'，属于'+ getRateDegree(latest).degree +'; 最近三十次平均BMI指数为' + aver + ',属于'+ getRateDegree(aver).degree +'。' + getRateDegree(latest).tip;
    return {type: 'rate', content: content}
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