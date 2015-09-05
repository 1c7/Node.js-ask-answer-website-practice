### 练手项目，做个问答网站练下 Node.js 和 MongoDB  

<br>
#### 具体用啥？

[Node.js](https://nodejs.org/)  
[Express.js 4.13.3](http://expressjs.com/) -- 框架  
[Jade](http://jade-lang.com/reference/case/) -- 模板引擎  
MongoDB  
Linux(Ubuntu 14.04)  
[Boostrap 3.3.5](http://getbootstrap.com/getting-started/#download)(因为现在4暂时还没出)  
jQuery  

<br>
#### 步骤
一步步简单来  
1. 提交问题(一个页面提交问题和问题描述，另一个页面看问题的列表)  
2. 回答问题  
__3. 账户(可以注册，登陆. 再随便做个账户页)__  
4. 设计下页面
    首页问题列表
    问题详情页
    注册页
    登陆页
4. 给问题下的回答点赞  
5. 第三方登陆(QQ, 新浪微博)  
6. 邮箱登录 - 确认邮箱  
7. 找回密码  
8. 简单统计页, 显示 问题总数 和 用户总数  




<br>
#### 目录说明

    public/ 静态文件目录  
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
    
    npm list --depth 0

来源: http://stackoverflow.com/questions/10972176/find-the-version-of-an-installed-npm-package  

<br>
##### 6. 拿 POST 参数
文档里有说具体方法  
http://expressjs.com/4x/api.html#req.body  
我概括下:  

    npm install body-parser  
    var bodyParser = require('body-parser');  

然后接收的地方这样写:

    app.post('/handle_submit', function (req, res) {
        var t = req.body.title;
        // 拿 POST 里的 title 参数
        // 如果没传这个参数, t 会等于 ''
        res.send(t);
    });


<br>
##### 7. 存密码时候用 bcrypt
我也没懂具体为啥网上推荐用 bcrypt, 有空仔细学下  

    var bcrypt = require('bcrypt-nodejs');  
    //    https://github.com/shaneGirish/bcrypt-nodejs  



http://codahale.com/how-to-safely-store-a-password/  



<br/>
#### 框架比较
https://www.airpair.com/node.js/posts/nodejs-framework-comparison-express-koa-hapi



<br/>
<br/>



