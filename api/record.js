var db = require('./model/db.js');
var util = require('./util.js');
var config = require('./config.js');
var ObjectId = require('mongodb').ObjectId;

/**
 * 
 * @param {string} phone 
 * @param {*} type 类型
 * @param {*} date 日期
 * @param {*} time 时间
 * @param {object} data 记录数据，因类型而异
 * @param {*} res 
 */
exports.addRecord = function(phone, type, date, time, data, res) {
    db.insertOne(type,{phone,date,time,data}, function(err, result){
        if (err) {
            util.result('104', '插入数据错误', null, res);
            return;
        }
        util.result('200', '保存成功', null, res);
    })
}

/**
 * 获取该类别健康信息的最近30条记录
 * @param {*} phone 
 * @param {*} type 
 * @param {*} res 
 */
exports.getRecords = function(phone, type, res){
    db.find(type, {phone}, function(err,result){
        if (err) {
            util.result('104', '读取数据错误', null, res);
            return;
        }
        var dataArr = [];
        var itemObj = {};
        for (let i = 0; i < result.length; i++) {
            if (result[i].date == itemObj.date) {
                itemObj.times.push({
                    data: result[i].data,
                    time: result[i].time,
                    id: result[i]._id
                });
            }else{
                if (itemObj.date) {//保存上一个对象到数组中,排除空对象,
                    dataArr.push(itemObj);
                    itemObj = {};
                }
                itemObj.date = result[i].date;
                itemObj.times = [{
                    data: result[i].data,
                    time: result[i].time,
                    id: result[i]._id
                }];
            }
            if (i == (result.length - 1)) {//最后一项了，添加当期对象到数组中
                dataArr.push(itemObj);
            }
        }
        util.result('200', '获取数据成功', { data: dataArr}, res);
    }, { 'date': -1, 'time': -1 }, config.records_num)
}

/**
 * 获取最新一条记录
 * @param {*} phone 
 * @param {*} type 
 * @param {*} res 
 */
exports.latestRecord = function (phone, type, res) {
    db.find(type, { phone }, function (err, result) {
        if (err) {
            util.result('104', '读取数据错误', null, res);
            return;
        }
        util.result('200', '获取数据成功', { data: result }, res);
    }, { 'date': -1, 'time': -1 }, 1)
}

/**
 * 根据id获取一条医疗记录信息
 * @param {*} phone 
 * @param {*} type 
 * @param {*} res 
 */
exports.getRecordById = function (type, id, res) {
    db.find(type, { _id: ObjectId(id) }, function (err, result) {
        if (err) {
            util.result('104', '读取数据错误', null, res);
            return;
        }
        if (result.length > 0) {
            var dataObj = {};
            dataObj.date = result[0].date;
            dataObj.time = result[0].time;
            dataObj.data = result[0].data;
            util.result('200', '获取数据成功', { data: dataObj }, res);
        } else {
            util.result('105', 'id不存在', null, res);
        }
    }, { 'date': -1, 'time': -1 }, 1)
}

/**
 * 
 * @param {string} phone 
 * @param {*} type 类型
 * @param {*} date 日期
 * @param {*} time 时间
 * @param {*} id
 * @param {object} data 记录数据，因类型而异
 * @param {*} res 
 */
exports.updateById = function (phone, type, id, date, time, data, res) {
    db.updateOne(type, { _id: ObjectId(id) }, { date, time, data}, function (err, result) {
        if (err) {
            util.result('107', '更新数据', null, res);
            return;
        }
        util.result('200', '更新成功', null, res);
    })
}