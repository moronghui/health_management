var MongoClient = require('mongodb').MongoClient;
var config = require('../config.js');


/**
 * 封装内部连接数据库函数
 * @param {*} callback 回调函数
 */
function _connectDB(callback) {
    var db_url = config.db_url;
    var db_name = config.db_name;
    MongoClient.connect(db_url, (err, client) => {
        if (err) {
            callback(err, null);
            return;
        }
        //var db = client.db(db_name);
        callback(err, client);
    })
}

/**
 *  插入一条记录
 * @param {*} collection 要插入的集合 
 * @param {*} json  插入的json格式数据
 * @param {*} callback  回调函数
 */
exports.insertOne = function(collection, json, callback) {
    _connectDB((err, client) => {
        if (err) {
            callback(err, null);
            return;
        }
        client.db(config.db_name).collection(collection).insertOne(json, (err ,result) => {
            if (err) {
                callback(err, null);
                client.close();
                return;
            }
            callback(err, result);
            client.close();
        })
    })
}

/**
 * 查询数据json为{}表示查询全部数据
 * sort {'token':1}1表示升序，-1表示降序
 * @param {*} collection 
 * @param {*} json 
 * @param {*} callback 
 */
exports.find = function(collection, json, callback, sort = null) {
    _connectDB((err, client) => {
        if (err) {
            callback(err, null);
            return;
        }
        var cursor = client.db(config.db_name).collection(collection).find(json).sort(sort);
        var result = [];
        cursor.each(function (err, doc) {
            if (err) {
                callback(err, null);
                client.close();
                return;
            }
            if (doc != null) {
                result.push(doc);
            } else {
                callback(null, result);
                client.close();
            }
        })
    })
}

/**
 * 更新一条数据
 * @param  {[type]}   collection [description]
 * @param  {[type]}   where      [description]
 * @param  {[type]}   setobj     [description]
 * @param  {Function} callback   [description]
 * @return {[type]}              [description]
 */
exports.updateOne = function(collection, where, setobj, callback) {
    _connectDB(function (err, client) {
        if (err) {
            callback(err, null);
            client.close();
            return;
        }
        client.db(config.db_name).collection(collection).updateOne(where, { $set: setobj }, function (err, result) {
            if (err) {
                callback(err, null);
                client.close();
                return;
            }
            callback(err, result);
            client.close();
        })
    })
}

