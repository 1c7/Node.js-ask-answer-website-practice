### 练手项目，做个问答网站练下 Node.js 和 MongoDB  

<br>
### 具体用啥？

Node.js + [Express.js 4.13.3](http://expressjs.com/) + [Jade](http://jade-lang.com/reference/case/)  
MongoDB  
Linux(Ubuntu 14.04)  

<br>
### 学习计划
1. 学 Express.js -- 怎么 MVC，以及其他一些概念  
2. 学 MongoDB   
3. package.json 怎么自动生成，标准在哪里？  

<br>
### 练习步骤
一步步简单来  
__1. 问答(一个页面提交问题和问题描述，另一个页面看问题的列表)__  
2. 账户(可以注册，登陆, 个人账户页的东西不多)  
3. 点赞  
4. ...?  

<br>
### 目录说明
public 静态文件, image/css/js  
views  模板文件  


<br>
### MongoDB 数据库设计(这个会根据情况不断改)

database name : ask-answer  

<br>

collection:
    q&a - 存所有的问题和回答数据
    user - 存用户数据


<br>
### 学到的东西 & 踩过的坑(把对大家可能有用的都列一下)

<br>
##### 1. 如果 Express.js 用 Jade 提示失败。  
那就是你的 Express.js 和 Jade 一个安装在本地，一个全局安装 (-g)  
造成了这种结果。  

<br>
##### 2. Jade 的变量语法是 #{name}  
如果要文本输出, 记得前面加个 |  
不然 #{name} 就变成个标签了  
比如 name = dave, 就会变成 <dave></dave>, 页面上你是看不到标签的, 看下网页源代码你就知道了  

<br>
##### 2. node_module 目录不用上传  
浪费 git push 的时间阿  
从 git 里移除掉的方法(不是删到回收站去, 只是让 git 不要对这个目录作版本管理了):  

    git rm --cached -r node_module  

ref: http://stackoverflow.com/questions/1143796/remove-a-file-from-a-git-repository-without-deleting-it-from-the-local-filesyste

<br>
##### 3. Ubuntu 操作 git 提交的时候连末尾带 ~ 符号的文件也提交上去了
比如有个 README.MD  还有个 README.MD~
查了资料发现那是 gedit 的文件备份, 
http://askubuntu.com/questions/90515/where-do-files-ending-with-a-come-from

从 git 里删除掉  ~ 后缀文件的方法是：

1. 先列出全部跟踪的文件, 看下哪些后缀为 ~

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
    var bodyParser = require('body-parser');  in your xxx.js file  

然后接收的地方这样写:

    app.post('/handle_submit', function (req, res) {
        var t = req.body.title;
        // 拿 POST 里的 title 参数
        // 如果没传这个参数, t 会等于 ''
        res.send(t);
    });

    
### 框架比较
https://www.airpair.com/node.js/posts/nodejs-framework-comparison-express-koa-hapi

























