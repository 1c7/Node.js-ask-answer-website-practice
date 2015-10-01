### 练手项目，做个问答网站练下 Node.js 和 MongoDB  


<br>
#### 具体用啥？
Linux(Ubuntu 14.04)  
[Node.js](https://nodejs.org/)  
[Express.js 4.13.3](http://expressjs.com/) -- 框架  
[handlebars](https://www.npmjs.com/package/handlebars) -- 模板引擎  
Jade 用过一阵子, 缩进(indent)太烦人了, 只能换掉.  
[MongoDB](https://www.mongodb.org/)  
[Boostrap 3.3.5](http://getbootstrap.com/getting-started/#download)(因为现在4暂时还没出)  
jQuery  
redis  
moment.js  
LESS  


<br>
#### Link
localhost:3000 首页  
http://localhost:3000/signup 注册页  
http://localhost:3000/login 注册页  
http://localhost:3000/profile 个人账户页  

HTTPS ON signup, login page, localhost test, how ?  



<br>
#### Problem
0. 整个问题块可点击
1. 最新问题应该  排最上面  
1. 提交问题时有  加载按钮  
1. 提交问题后 跳到问题页  
1. 问题页 有添加描述按钮  
1. 没登陆的时候时候进首页跳转到登陆页
1. 设计登陆页
1. 实现登陆页面
1. 支持扣扣登陆
1. 微博登陆
1. 


<br>
#### 步骤
一步步来(加粗代表目前的进度)  
1. 提交问题(一个页面提交问题和问题描述，另一个页面看问题的列表)  
2. 回答问题  
3. 账户(可以注册，登陆, 登出)(session)  
4. 问题详情页(有问题标题, 问题描述, 然后是其他人的回答)  
4. (2015-9-9 done)把回答问题功能改成必须登陆  
5. (2015-9-12 done) Design "首页(问题列表)"  
6. (2015-9-13 done) 实现"首页(问题列表)"的前端  
7. (2015-9-13 done) Design "问题详情页"  
7. (2015-9-13 done) 实现"问题详情页"的前端  
__8. (2015-9-13 working) Design 注册和登陆页面__  
5. 问题详情页的回答不只是显示内容.   
要相对时间(20分钟前, 2个月前, 一年前),  
鼠标放上去显示绝对时间(2015年8月18号 13:22)  
也要显示回答者的名字  
4. 给回答点赞  
6. 给回答点踩  
7. 取消回答的赞  
9. 取消回答的踩  
4. 怎么用 redis 存 session
5. 第三方登陆(QQ, 新浪微博)  
6. 邮箱登录 - 确认邮箱  
7. 找回密码  
8. 简单统计页, 显示 问题总数 和 用户总数  


<br>
#### 每个步骤都要考虑的
1. 是否可能造成 XSS ?  
如果是, 过滤用户输入的数据  
XSS is an output problem __not__ an input problem  



<br>
#### 目录说明

    public/ 资源文件目录  
        public/css/  存 css 文件
        public/js/  存 js 文件
        public/images/  网站本身的图片  
        public/font/  bootstrap 的字体目录 
    views/  模板文件目录  
    img/  用户的图片, 比如头像等等  


<br>
#### MongoDB 数据库设计(根据情况不断改)

    database name : ask-answer  

    collection:  
        qa - 存问题和回答数据  
        account - 存登陆数据(用户名, 密码, 邮箱, 各类社交平台的第三方登陆ID)  
        user - 存用户信息(用户的名字, 比如："格拉瓦的春天". 还有性别, 等等)  
        stat - 存统计数据, 比如每一天的问题数和用户数  



<br>
#### 学到的东西 & 踩过的坑

##### 1. 如果 Express.js 用 Jade 提示失败。  
那就是 Express.js 和 Jade 一个安装在本地，一个全局安装 (-g)  
造成了这种结果  
再安装下就好了, 比如试下 npm install jade 试下安装到本地 node_modules/ 里  
然后再试试, 不行就再装下 Espress.js

<br>
##### 2. Jade 的变量语法是 #{name}  
如果要文本输出, 记得前面加个 |  
不然 #{name} 就变成个标签了  


<br>
##### 2. node_module 目录不用上传  
浪费 git push 的时间  
从 git 里移除掉的方法(不是删到回收站去, 只是让 git 不要对这个目录作版本管理了):  

    git rm --cached -r node_module  

ref: http://stackoverflow.com/questions/1143796/remove-a-file-from-a-git-repository-without-deleting-it-from-the-local-filesyste

<br>
##### 3. Ubuntu 操作 git 提交的时候连末尾带 ~ 符号的文件也提交上去了
比如有个 README.MD  还有个 README.MD~
查了资料发现那是 gedit 的文件备份, 
http://askubuntu.com/questions/90515/where-do-files-ending-with-a-come-from

从 git 里删除掉  ~ 后缀文件的方法是：

先列出全部跟踪的文件, 看下哪些后缀为 ~

    git ls-tree -r master --name-only
    
http://stackoverflow.com/questions/15606955/how-can-i-make-git-show-a-list-of-the-files-that-are-being-tracked

我这边的结果是


    1c7-server.js~
    README.md
    README.md~
    index.js
    index.js~
    package.json
    package.json~
    submit.html~
    views/display.html
    views/display.html~
    views/submit.html~
    views/submit.jade
    views/submit.jade~


然后
  
    git rm 1c7-server.js~
    git rm README.md~
    git rm index.js~
    git rm package.json~
    git rm submit.html~
    git rm views/display.html~
    git rm views/submit.html~
    git rm views/submit.jade~


别忘了 git add, git commit, git push

<br>
##### 4. package.json 的标准在?

http://blog.nodejitsu.com/package-dependencies-done-right/  
http://browsenpm.org/help  


<br>
##### 5. 查看版本
想看本地安装的所有包的版本, 用:

```javascript
    npm list --depth 0
```

来源: http://stackoverflow.com/questions/10972176/find-the-version-of-an-installed-npm-package  

<br>
##### 6. 拿 POST 参数
文档里有说具体方法  
http://expressjs.com/4x/api.html#req.body  
我概括下:  

```javascript
npm install body-parser  
var bodyParser = require('body-parser');  
```

然后接收的地方这样写:

```javascript
    app.post('/handle_submit', function (req, res) {
        var t = req.body.title;
        // 拿 POST 里的 title 参数
        // 如果没传这个参数, t 会等于 ''
        res.send(t);
    });
```

<br>
##### 7. 存密码时候用 bcrypt
我也没懂具体为啥网上推荐用 bcrypt, 有空仔细学下  

```javascript
    var bcrypt = require('bcrypt-nodejs');  
    //    https://github.com/shaneGirish/bcrypt-nodejs  
```


http://codahale.com/how-to-safely-store-a-password/  


<br>
##### 8. Github 有自己的 Markdown 语法
看到别人的文档都很不错, 代码有高亮  
翻了一下居然有  
<pre>
```javascript
```
</pre>
这种写法(代码放```之间)  

全文档在这边:  
https://help.github.com/articles/github-flavored-markdown/  


<br>
##### 9. Middleware
Most middleware (like session) is no longer bundled with Express and must be installed separately. Please see https://github.com/senchalabs/connect#middleware.

https://github.com/senchalabs/connect#middleware

__Express.js 4 把所有中间层(Middleware)拆出来了__

The bundled middleware with Express are the things we use to configure our application. They were things like bodyParser, cookieParser, session, and others.

They were removed into their own modules so that they could receive fixes, updates, and releases without impacting the main express release cycles.  

意思就是说把他们拆分出来之后就可以单独更新维护，  
不用更新完这些小东西之后还得去改 Express.js 的版本号  

来源：https://scotch.io/bar-talk/expressjs-4-0-new-features-and-upgrading-from-3-0


<br>
##### 11. git 只 add tracked file

    git add -u

<br>
##### 12. 安装模块安装不上, 用sudo 也不行，而且报错  
This failure might be due to the use of legacy binary "node"  

  sudo apt-get install nodejs-legacy

http://stackoverflow.com/questions/21168141/can-not-install-packages-using-node-package-manager-in-ubuntu  


<br>
##### 13. node.js 安装  
https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-an-ubuntu-14-04-server

<br>
##### 14. node.js 用 less
```javascript
var lessMiddleware = require('less-middleware');
app.use(lessMiddleware(__dirname + '/public', {'debug':true}));
// https://github.com/emberfeather/less.js-middleware
```
debug = true 对调试非常有用,会在控制台输出会去哪里找了 less 文件,然后编译之后放到哪里了.



<br>
##### 15. 进 mongodb 删光制定集合数据
```
> mongo  
> show dbs;  
> use xxx (xxx is db name)
> show collections
> db.xxx.remove({})
之后 xxx 这个 collection 里的数据就被清空了
```


<br>
##### 16. Ubuntu 上虚拟键盘的安装方法:
```
sudo apt-get install onboard  先安装
onboard 调用出来
```
因为我的q键坏掉了... 
windows 的 Ctrl+R 输入 osk 调用出虚拟键盘,是没法输入到虚拟机的 Ubuntu 里面的..  


<br>
##### 17. 占位


<br/>
<br/>
#### 教程

##### 1. Express.js 4 和 3 的主要区别  
https://scotch.io/bar-talk/expressjs-4-0-new-features-and-upgrading-from-3-0  
最好扫读一下，因为网上的教程有不少都是 版本3 的.  
然后你实际用的时候就会报错  

##### 2. 框架比较
https://www.airpair.com/node.js/posts/nodejs-framework-comparison-express-koa-hapi























