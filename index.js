// TODO
/*
  1. index page
*/

var handlebars = require('handlebars');
// http://handlebarsjs.com/
// https://www.npmjs.com/package/handlebars


var fs = require('fs');



var express = require('express');
var app = express();
// express.js 框架

var path = require('path');
//  https://nodejs.org/docs/latest/api/path.html

var session = require('express-session');
var sess;

var bodyParser = require('body-parser');
// 拿 POST 参数

var bcrypt = require('bcrypt-nodejs');
// 加密密码用的  https://github.com/shaneGirish/bcrypt-nodejs

// var redis = require('redis');
// 内存数据库
// 别忘了 redis 是一个, nodejs 这边的 redis 交互又是一个, 两码事
// https://cnodejs.org/topic/5200755c44e76d216a1620df
// http://www.sitepoint.com/using-redis-node-js/

/*
var redis_client  = redis.createClient('6379', '127.0.0.1');
redis_client.on("error", function(error) {
    console.log(error);
});
*/

var sass = require('node-sass');



var moment = require('moment');
// 一个处理时间非常方便的库
// http://momentjs.com/docs/


var xss = require('xss');
// 防 XSS 攻击用
// https://www.npmjs.com/package/xss


/*

var RedisStore = require('connect-redis')(session);

app.use(session({
    store: new RedisStore(),
    secret: 'keyboard cat99786'
}));
*/
// 用 redis 来存 session
// connect-redis 的 Github: https://github.com/tj/connect-redis
// http://segmentfault.com/a/1190000002488971#articleHeader4
// http://blog.arisetyo.com/?p=492


// session secret
// 我也暂时没懂, 反正是和安全相关的东西
// http://stackoverflow.com/questions/18565512/importance-of-session-secret-key-in-express-web-framework




/* ===========================

       配置  Setting
    
=============================*/

// SESSION
app.use(session({
  secret: 'keyboard cats2',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: true }
}))


var lessMiddleware = require('less-middleware');
app.use(lessMiddleware(__dirname + '/public', {'debug':true}));
//app.use(express.static(__dirname + '/public'));
// https://github.com/emberfeather/less.js-middleware





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
app.use(express.static(path.join(__dirname, 'public')));



/* ======================

    数据库   Database
    
========================= */

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



/* ======================

     路由   Routing
    
=========================*/



// 问题列表页
app.get('/', function (req, res) {

  fs.readFile('views/index.html', 'utf-8', function(error, source){
    var template = handlebars.compile(source);
    //var html = template(data);
    var html = template();
    res.write(html);
    res.end();
  });


    var data = {};
    // 这个传给 view

  if (typeof sess !== 'undefined' 
    && typeof sess.userName !== 'undefined') {
        data.userName = sess.userName;
  }


    // Connect to the db
    MongoClient.connect(db_url, function(err, db) {
        if(err) { return console.dir(err); }

        //var r = db.qa.find();
        var collection = db.collection('qa');

        collection.find().toArray(function (err, result) {
          if (err) {

            console.log(err);

          } else if (result.length) {

            data.result = result
            console.log('Found:', result);
            res.render('display', { 'r': data });

          } else {
            res.write('no result');
            res.end();
          }
          //Close connection
          db.close();
        });
    
        //console.log(r);
        //
    });
 
    
});



// 提交页面
app.get('/submit', function (req, res) {
  	//res.send('Hello World!');
	//res.sendfile('./views/submit.html');
	res.render('submit', { title: 'Hey', message2: 'Hello there!'});
	// 因为设置了 views 变量，所以会去找 views/submit.jade
	// 注意后缀, 用submit.html会报错
});



// 处理提交页面
app.post('/h_submit', function (req, res) {

    // 接收和检查问题标题
     var t = req.body.title;
     if(t == ''){
        res.send('必须输入问题的标题!');
        return;
     }
     
     
     // 问题描述
     //var d = req.body.desc;
     //if( d == ''){
        var doc = {'title':t}
     //}else{
     //  var doc = {'title':t, 'desc':d}
     //}


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






// 问题详情页
app.get('/question/:id', function (req, res) {

/*
res.write('asd');
res.end();
return;
*/

    var data = {};
    // 这个传给 viewanswer


    if (typeof sess !== 'undefined' && typeof sess.userName !== 'undefined') {
      data.userName = sess.userName;
    }
    // 是否已登陆? 登陆的话拿用户名
    

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
          // 如果拿得到结果
          
            console.log(data.userName);
            console.log('Found:', result);
            console.log(result[0].comments);
            if(result[0].comments != undefined){
               // 把时间戳, 比如 1441763106968 变成人类可读形式: 2015年3月12号
              result[0].comments.forEach(function(item){
                  console.log(item.time);
                  var date = moment(item.time);
                  var year = date.format('YYYY'); // YYYY == 1970 1971 ... 2029 2030
                  var month = date.format('M'); // M == 1 2 ... 11 12
                  var day = date.format('D');  // D == 1 2 ... 30 31
                  var hour = date.format('HH');  // HH == 00 01 ... 22 23
                  var minute = date.format('mm'); // mm == 00 01 ... 58 59 
                  
                  var s = date.fromNow(); // an hour ago | 29 minutes ago | a few seconds ago
                  // 这是英文的, 我们要转成中文： 一个小时前, 29分钟前
                  //moment(item.time)
                  console.log(s);
                  console.log(year+'年'+month+'月'+day+'日'+hour+':'+minute)
              })           
            
            }

            
            
            data.result = result[0];
            res.render('question', { 'r': data });
            
          } else {
            res.write('no result!!!');
            res.end();
          }
          //Close connection
          db.close();
        });
    
        //console.log(r);
        //
    });

    
});


// 回答
app.post('/answer', function (req, res) {

    console.log(typeof sess);
    
    // 1. 检查登陆了没有
    if (typeof sess === undefined) {
       res.write('你没登陆!');
       res.end();
    }
    
    if (typeof sess !== 'undefined' && typeof sess.userName !== 'undefined') {
      //data.userName = sess.userName;
    }

    // 2. 检查参数是否足够: 回答内容(answer), 问题ID(qid)
     var answer = req.body.answer;
     var qid = req.body.qid;
     if(answer === '' || qid === ''){
        res.send('参数不足, 无法回答');
        return;
     }
    
    
    
    var answer = xss(answer);
    // 把回答过滤一下，防 XSS 攻击


    qid = Number(qid);
    // MongoDB 里 qid 是数字, 这里是字符串
    // 不转类型的话数据库会找不到的
    
    var comment = {
      'content' : answer,
      'time' : Date.now()
    }
     
    // 存 MongoDB
    MongoClient.connect(db_url, function(err, db) {
        if(err) { return console.dir(err); }

        var collection = db.collection('qa');
        collection.update( {'qid':qid}, {$push: {comments: comment}} );
        
    });
     
    res.redirect(req.get('referer'));
    // 刷新页面
});


// 给回答点赞
app.get('/answer-upvote', function (req, res) {
    res.write("asdasd");
    res.end();
});

// 给回答点踩
app.get('/answer-downvote', function (req, res) {
    res.write("asdasd");
    res.end();
});

// 取消赞和踩先不管



// 注册账户页面
app.get('/account/signup', function (req, res) {
    //res.render('signup');
    
res.set({
  'Content-Type': 'text/html'
});

    // set http header
    res.sendfile('./views/signup.jade');
});



// ajax - 账户名是否已经存在?
app.get('/account/username_exists', function (req, res) {
  
});





// 处理注册请求
app.post('/account/handle_signup', function (req, res) {

  // 参数是否完整
  var username = req.body.un;
  var password = req.body.pwd;
  var confirm_password = req.body.confirm_pwd;
  
  if(username === '' || password === ''|| confirm_password === ''){
      res.send('参数不全');
      return;
  }
  
  if(password != confirm_password){
      res.send('两次密码不一致!');
      return;
  }
  
  // 对用户名进行操作
  // 检查用户名是否合法，
  // 用户名中不允许的字符是:
  
  
  // var uid =
  // 弄个 user id
  
  
 
  
  // 账户是否已经存在?
  MongoClient.connect(db_url, function(err, db) {
        if(err) { return console.dir(err); }

        var collection = db.collection('account');
        collection.findOne({'username':username}, function(err, r){
            if(r != null){
              res.send("用户名已存在");
              console.log("用户名已存在");
              return;
            }else{
              
              // 加密密码
              var salt = 'yoyo-ask-answer-19';
              password = password + salt;
              
              password = bcrypt.hashSync(password);
              // 如何安全存储密码?
              // http://codahale.com/how-to-safely-store-a-password/
  
              var creationDate = Date.now();
  
              var doc = {
                // 'userID' : 
                'username' : username, 
                'password' : password,
                'creationDate' : creationDate
              };

              collection.insert(doc);
              
            }
        });
        
  });

  
  
  
  // 重定向到登陆页
  res.redirect('./login');
});




// 登陆页面
app.get('/account/login', function (req, res) {

  res.set({
    'Content-Type': 'text/html'
  });
    res.sendfile('./views/login.jade');
    
});




// 处理登陆请求
app.post('/account/handle_login', function (req, res) {

  // 参数是否完整
  var username = req.body.un;
  var password = req.body.pwd;
  if(username === '' || password === ''){
      res.send('[登陆失败]参数不全');
      return;
  }
  
  // salt
  var salt = 'yoyo-ask-answer-19';
  password = password + salt;
  
  
  sess=req.session;
  
  
  // 查 MongoDB
  MongoClient.connect(db_url, function(err, db) {
      if(err) { return console.dir(err); }

      var collection = db.collection('account');

      collection.findOne({'username':username}, function(err, account) {

        console.log(account);
        if(account == null){
          res.send('账户不存在');
          return;
        }

        // https://github.com/shaneGirish/bcrypt-nodejs
        bcrypt.compare(password, account.password, function(err, ress) {
          if(ress){
            console.log('密码正确');
            // session 在此, 谁敢造次?

            sess.already_login = 1;
            sess.userName = account.username;
            //sess.qid = account.username;
            
            //sess.haha = {'water':'white', 'kevin':'gay'};
            // 嵌套要这样来
            
            console.log(sess);
            res.redirect('/');
            return;
            
          }else{
             console.log('密码错');
             res.redirect('./login');
             return;
          }
        });
        
      });

   });
      
    
});



// 退出
app.get('/account/logout', function (req, res) {

  sess = '';
  res.redirect('/');
  
});


// 忘记密码页
app.get('/forget-password', function (req, res) {

  // 在页面上输入账户名
  // 提交
  
});

// 处理-忘记密码页
app.post('/forget-password-handle', function (req, res) {

  // 接账户名
  // 取邮箱
  // 给邮箱发重置密码邮件

  
});


// 账户页面
// xxx.com/profile/账户名
// localhost:3000/profile/asdasd
app.get('/profile/:username', function (req, res) {
    
    var username = req.params.username;
    res.write(username);
    
    
  /*
  MongoClient.connect(db_url, function(err, db) {
    if(err) { return console.dir(err); }

      var collection = db.collection('user');
      collection.findOne({'username':username}, function(err, account) {
        console.log(account);
        if(account == null){
          res.send('账户不存在');
          return;
        }
      }); // findOne end
  });// MongoClient end
  */

    res.end();

  
});



/* ========================================

    后台

========================================== */


app.get('/42admin', function (req, res) {


});


app.get('/42admin/handle_login', function (req, res) {


});


app.get('/42admin/handle_logout', function (req, res) {


});

// 统计页
/*
  1. 有多少个问题
  2. 多少个用户
*/
app.get('/stat', function (req, res) {

    res.send("统计页尚未完成");

});


/* ========================================

    下面是帮忙测试的一些函数, 上线时要删掉

========================================== */


// ajax拿首页
app.post('/ajax-index', function (req, res) {


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
            res.write( JSON.stringify(result) );
            res.end();

          } else {
            res.write('no result');
            res.end();
          }
          //Close connection
          db.close();
        });
    
        //console.log(r);
        //
    });

});




// 测试页
app.get('/test', function (req, res) {




  

//res.render('haha', { title: 'Hey', message2: 'Hello there!'});

return;



// handlebars
var data = { "name": "Alan", "hometown": "Somewhere, TX",
             "kids": [{"name": "Jimmy", "age": "12"}, {"name": "Sally", "age": "4"}]};


fs.readFile('views/mush.html', 'utf-8', function(error, source){
  var template = handlebars.compile(source);
  var html = template(data);
  res.write(html);
  res.end();
});









  //res.write('asdas');
  //res.end();
  //res.sendFile(path.join(__dirname + '/views/haha.html'));
    //res.sendFile(path.join(__dirname + '/haha.html'));
return;
// 测XSS的
/*
var html = xss('<script>alert("xss");</script>');
console.log(html);
return;
*/

    
  var a = req.session.haha;
  console.log(a);
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


// 查看所有 session
app.get('/session', function (req, res) {
  
  console.log(sess);
  //res.write('a');
  //res.write(sess);
  res.send(sess);

});





/* ========================================

    服务器, 我以代码之名启动你

========================================== */

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('listening at http://%s:%s', host, port);
});




// 判断是否数字
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}
// http://stackoverflow.com/questions/18082/validate-decimal-numbers-in-javascript-isnumeric













