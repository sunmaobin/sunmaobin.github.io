---

title: HTML解惑-include方法
date: 20160613034301
categories: [WEB]
tags: [html]

---

html为什么要使用include？如何include？

## 一、为什么要include

我们知道，web的三驾马车：html, js和css，其中：

* js 我们由传统的所有逻辑写到一个js文件中，现在我们都提倡分模块开发，于是涌现出来 `require.js` 、 `sea.js` 和 `CommonJs` 等模块加载框架，以及 `AMD` 、`CMD` 等模块加载机制，同时ES6也提供了 `class` 和 `modules` 等机制，目的只有一个：模块化开发。

* css 我们在页面上通过 `link` 可以引入各个css文件，在css里面可以使用 `import` 来引入其他css文件，为什么要这么做？如果所有文件都写在一个里面，那要这么引入干嘛？目的只有一个：模块化开发。

* html 如何模块化开发？(⊙o⊙)…？顿时脑子里有点懵！其实，html模块化开发，可以有很多办法，比如：
	* 使用js模板引擎，将html模块化为模板，然后在使用的时候通过ajax载入，但是这个不利于SEO；
	* 另一个办法是分模块开发，使用gulp等工具打包的同时，使用gulp的一些include的插件，重新编译html文件；
	* 且看下文！

## 二、html如何include

通过上面的分析，我们至少有了2种办法，来分模块开发html，但是我们不使用js，也不用gulp等编译工具，有木有办法 include 一个模板？答案是：有。

我们都知道动态脚本语言都有include方法，比如：

* JSP

```html
<jsp:include>
<jsp:forward>
```

* ASP

```html
<!--# include file="file.tpl" -->
```

但是 `html` 这种静态的页面，如何实现include呢？答案是：SSI技术。

* 什么是SSI

SSI 全称是 Server Side Include，也就是服务端引入技术，引入的是什么呢？是CGI。

* 什么是CGI

CGI 全称是 Common Gateway Interface，也就是通用网关接口，一个在Web服务器中使用的技术。

通过SSI引入CGI就可以实现服务器端Include，那具体怎么做呢？

看看Apache服务器的SSI，你就全然知晓啦！

移步至：[https://httpd.apache.org/docs/current/howto/ssi.html](https://httpd.apache.org/docs/current/howto/ssi.html)

现在知道html中如何使用include了吧，说白了，只要web服务器支持的语法，html就可以写。

以后在html中见到如下语句，不要惊慌，那是SSI，而不是什么PHP语法，也不是JSP语法

```html
<!--# include virtual="xxx" -->
```

## SSI的问题

1. 特定语法对于特定的WEB容器有强依赖，以后更换WEB容器可能导致程序无法运行；
2. 性能问题
3. 安全问题

参考：[http://www.t086.com/code/apache2.2/misc/security_tips.html](http://www.t086.com/code/apache2.2/misc/security_tips.html)