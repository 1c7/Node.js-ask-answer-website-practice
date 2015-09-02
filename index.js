var express = require('express');
var path = require('path');
var app = express();
var mongoose = require('mongoose');

/*
var db = mongoose.connect('mongodb://localhost/chihuo');//；连接数据库
var Schema = mongoose.Schema;   //  创建模型
var userScheMa = new Schema({
    name: String,
    password: String
}); //  定义了一个新的模型，但是此模式还未和users集合有关联
exports.user = db.model('users', userScheMa); //  与users集合关联
*/


/*

	路由

*/


app.get('/', function (req, res) {
  res.send('Hello World!');
});

// 提交页面
app.get('/submit', function (req, res) {
  	//res.send('Hello World!');
	res.sendfile('./views/submit.html');
});


// 查看页面
app.get('/list', function (req, res) {
  res.sendfile('./views/display.html');
});


// 设定views变量，意为视图存放的目录
app.set('views', path.join(__dirname, 'views'));




// 设定view engine变量，意为网页模板引擎
app.set('view engine', 'jade');



// 设定静态文件目录，比如本地文件
// 目录为demo/public/images，访问
// 网址则显示为http://localhost:3000/images
app.use(express.static('public'));





var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('Example app listening at http://%s:%s', host, port);
});




// 怎么和数据库交互?
// 问题: jade 模板管用吗?












