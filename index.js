var express = require('express');
var path = require('path');
var app = express();
//var jade = require('jade');
var bodyParser = require('body-parser');


/*
    配置
*/
app.use(bodyParser.json()); 
// for parsing application/json

app.use(bodyParser.urlencoded({ extended: true })); 
// for parsing application/x-www-form-urlencoded

// 设定views变量，意为视图存放的目录
app.set('views', path.join(__dirname, 'views'));

// 设定view engine变量，意为网页模板引擎
app.set('view engine', 'jade');

// 设定静态文件目录，比如本地文件
// 目录为demo/public/images，访问
// 网址则显示为http://localhost:3000/images
app.use(express.static('public'));




/*
    数据库
*/
// Retrieve
var MongoClient = require('mongodb').MongoClient;
var db = require('mongodb').Db;
// https://mongodb.github.io/node-mongodb-native/api-generated/collection.html


var port = '27017';
var db_url = "mongodb://localhost:"+port+"/ask-answer";

// 连一下测试一下
MongoClient.connect(db_url, function(err, db) {
  if(!err) {
    console.log('Successfully connect to', db_url);
  }
});



/*
    路由
*/

/*
app.get('/', function (req, res) {
  res.send('Hello World!');
});
*/

// 提交页面
app.get('/submit', function (req, res) {
  	//res.send('Hello World!');
	//res.sendfile('./views/submit.html');
	res.render('submit', { title: 'Hey', message2: 'Hello there!'});
	// 因为设置了 views 变量，所以会去找 views/submit.jade
	// 注意后缀, 用submit.html会报错
});


// https://mongodb.github.io/node-mongodb-native/api-articles/nodekoarticle1.html



// 处理提交页面
app.post('/h_submit', function (req, res) {

    // 接收和检查问题标题
     var t = req.body.title;
     if(t == ''){
        res.send('必须输入问题的标题!');
        return;
     }
     
     
     // 问题描述
     var d = req.body.desc;
     if( d == ''){
        var doc = {'title':t}
     }else{
        var doc = {'title':t, 'desc':d}
     }


    // 生成一个问题ID, 问题详情页需要用到
    /*
        打算:
        格式是 000000  6位数
        比如  230123
        我们不从 000001 开始, 
        因为这样容易被爬虫折腾, 随便哪个人都能写个程序遍历所有页面
        而且也容易让人知道网站到底有多少个问题
        比如 002301  就是有 2301 个问题
        
        1. 6位
        2. 全数字
        3. 不重复
        4. 不连续
        
        实际:
        我好懒啊，先用时间戳顶着吧，以后再改;
    */

    var qid = Date.now();
    doc['qid'] = qid;
    
    console.log(doc);


    // 存 MongoDB
    MongoClient.connect(db_url, function(err, db) {
        if(err) { return console.dir(err); }

        var collection = db.collection('qa');
        collection.insert(doc);
        
    });

    
    // insert 怎么检测成功失败?
    // https://mongodb.github.io/node-mongodb-native/api-articles/nodekoarticle1.html
    res.redirect('/'); // 302 重定向
    //res.send('ok');


});



// 问题列表页
app.get('/', function (req, res) {

    // Connect to the db
    MongoClient.connect(db_url, function(err, db) {
        if(err) { return console.dir(err); }

        //var r = db.qa.find();
        var collection = db.collection('qa');

        collection.find().toArray(function (err, result) {
          if (err) {
            console.log(err);
          } else if (result.length) {
            console.log('Found:', result);
            res.render('display', { 'r': result });
          } else {
            res.render('display', { 'r': result });
          }
          //Close connection
          db.close();
        });
    
        //console.log(r);
        //
    });

    
});



// 问题详情页
app.get('/question/:id', function (req, res) {

    var qid = req.params.id;
    // quesiton id
    // typeof qid === string
    
    // 检测参数是否合法
    // 1. question id 必须是全数字的. 不得包含任何字母或特殊符号
    // 2. id 长度必须符合特定位数, 不然也不用查数据库了.
    // 我们现在用的是时间戳, 比如 1441365036033, 一共13位
    // 如果不合法则 404
    // 如果合法就展示问题详情
    
    if(isNumeric(qid) === false){
        res.send('参数错误, question id 必须是全数字');
        return;
    }
    
    if(qid.length != 13){
        res.send('quiestion id 位数不对, 应该是13位');
        return;
    }

    qid = Number(qid);
    // MongoDB 里 qid 是数字, 这里是字符串
    // 不转类型的话数据库会找不到的

    MongoClient.connect(db_url, function(err, db) {
        if(err) { return console.dir(err); }

        var collection = db.collection('qa');

        collection.find({'qid':qid}).toArray(function (err, result) {
          if (err) {
            console.log(err);
          } else if (result.length) {
            console.log('Found:', result);
            res.render('question', { 'r': result[0] });
          } else {
           // get nothing
            //res.render('display', { 'r': result });
          }
          //Close connection
          db.close();
        });
    
        //console.log(r);
        //
    });

    
});


// 处理评论
app.post('/comment', function (req, res) {

     // 接收和检查问题标题
     var c = req.body.comment;
     var qid = req.body.qid;
     if(c === '' || qid === ''){
        res.send('参数不足, 无法评论');
        return;
     }
     
    qid = Number(qid);
    // MongoDB 里 qid 是数字, 这里是字符串
    // 不转类型的话数据库会找不到的
     
    // 存 MongoDB
    MongoClient.connect(db_url, function(err, db) {
        if(err) { return console.dir(err); }

        var collection = db.collection('qa');
        collection.update( {'qid':qid}, {$push: {comments: c}} );
        
    });
     
    res.redirect(req.get('referer'));
    // 刷新页面
});






// 测试页
// 比如你想测一个随机数生成算法, 想在网页看到效果，就用这个
app.get('/test', function (req, res) {

/*
    思路
    看mongodb里有没有那个数字
*/
    // Date.now() == 1441364199786
    // 类似这样的
    res.send('a'+Date.now());
    return;


    MongoClient.connect(db_url, function(err, db) {
        if(err) { return console.dir(err); }

        var collection = db.collection('qid');

        collection.find().toArray(function (err, result) {
          if (err) {
            console.log(err);
          } else if (result.length) {
            console.log('Found:', result);
            res.render('display', { 'r': result });
          } else {
            res.render('display', { 'r': result });
          }
          //Close connection
          db.close();
        });
    
        //console.log(r);
        //
    });
    
});



var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('listening at http://%s:%s', host, port);
});




function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
// http://stackoverflow.com/questions/18082/validate-decimal-numbers-in-javascript-isnumeric













