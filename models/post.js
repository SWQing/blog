/**
 * Created by su on 2017/8/18.
 */
var mongo = require('./db');
//name 发表文章的用户名
//title 文章标题
//post 文章内容
function Post(name, title, post) {
    this.name = name;
    this.title = title;
    this.post = post;
}
module.exports = Post;
//保存文章
Post.prototype.save = function (callback) {
    var date = new Date();
    var time = {
        //原始的格式
        date:date,
        //当前时间的年份
        year:date.getFullYear(),
        // 当前时间 年份 + 月份
        month:date.getFullYear() + '-' + (date.getMonth() < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)),
        // 当前时间 年份 + 月份 + 天
        day:date.getFullYear() + '-' + (date.getMonth() < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + '-' +
        (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()),
        //当前时间 年份 + 月份 + 天 + 小时 + 分钟 + 秒
        minute:date.getFullYear() + '-' + (date.getMonth() < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)) + '-' +
        (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ' + (date.getHours() < 10 ? '0' +
            date.getHours() : date.getHours()) + ':' + (date.getMinutes() < 10 ? '0' + date.getMinutes():date.getMinutes()) + ':' +
        (date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds())
    };
    //把需要写入的数据全部放在post对象上
    var post = {
        name: this.name,
        time: time,
        title: this.title,
        post: this.post
    }
    //打开数据库
    mongo.open(function (err, db) {
        if(err) {
            return callback(err);
        }
        db.collection('posts', function (err, collection) {
            if(err) {
                mongo.close();
                return callback(err);
            }
            collection.insert(post, {safe: true}, function (err, post) {
                mongo.close();
                if(err) {
                    return callback(err);
                }
                return callback(null);
            })
        })
    })
}
//读取文章列表
Post.get = function (name, callback) {
    mongo.open(function (err, db) {
        if(err) {
            return callback(err);
        }
        db.collection('posts', function (err, collection) {
            if(err) {
                mongo.close();
                return callback(err);
            }
            var query = {};
            if(name) {
                query = {name: name};
            }
            collection.find(query).sort({time: -1}).toArray(function (err, docs) {
                mongo.close();
                if(err) {
                    return callback(err);
                }
                return callback(null, docs);
            })
        })
    })
}