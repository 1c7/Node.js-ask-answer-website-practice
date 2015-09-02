### 练手项目，做个问答网站练下 Node.js 和 MongoDB  

<br>
### 具体用啥？

Node.js + [Express.js](http://expressjs.com/) + [Jade](http://jade-lang.com/reference/case/)  
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
### 数据库设计
占个位置下次写


<br>
### 学到的东西 & 踩过的坑(把觉得对大家有用的东西都列一下)
1. 如果 Express.js 用 Jade 提示失败。  
那就是你的 Express.js 和 Jade 一个安装在本地，一个全局安装 (-g)  
造成了这种结果。  

2. Jade 的变量语法是 #{name}  
如果要文本输出, 记得前面加个 |  
不然 #{name} 就变成个标签了  
比如 name = dave, 就会变成 <dave></dave>, 页面上你是看不到标签的, 看下网页源代码你就知道了  

2. node_module 目录不用上传  
浪费 git push 的时间阿  
从 git 里移除掉的方法(不是删到回收站去, 只是让 git 不要对这个目录作版本管理了):  


3. 























