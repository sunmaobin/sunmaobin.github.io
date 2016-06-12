---

title: JS解惑-function前面有+和!等特殊字符
date: 20160612090419
categories: [WEB]
tags: [js]

---

让一个函数页面加载后就运行，你的脑海中能想出几种办法呢？

本文就总结下一些常用的办法，同时一些不常用的，但是在一些牛人写的框架的源码中经常会出现的函数自执行的方法。

## 一、几种常见的方法

### 1、在body中直接执行方法

```js
function autoFun(){};
autoFun();
```

### 2、在head中window.onload 函数中执行函数

```js
function autoFun(){};
window.onload = function(){
    autoFun();
};
```

### 3、使用body的onload事件执行

```js
<script>
function autoFun(){};
</script>

<body onload="autoFun()">

</body>
```

### 4、借助jquery的启动函数执行

```js
function autoFun(){};
$(function(){
    autoFun();
});
```

### 5、使用匿名函数执行

jquery 插件就是这么用的。

```js
(function(){})();
```


## 二、两种不常见的用法

### 1、+function

```js
+function autoFun(){}();
```

### 2、!function

bootstrap 组件就是这么用的。

```js
!function autoFun(){}();
```

以上两种方法，都是在function前面，增加了操作符，于是函数就自动运行了，原理是什么呢？

答案是：通过操作符，将函数申明变为函数表达式，然后再执行。

比如：!function autoFun(){}(); 可以这么理解。

* 第一步：var autoFun = function (){} //函数表达式
* 第二步：!autoFun(); //执行函数

具体哪些操作符，可以达到这个目的，参考：[http://swordair.com/function-and-exclamation-mark/](http://swordair.com/function-and-exclamation-mark/)

另外，如果不知道 `函数申明` 和 `函数表达式` 的，请自行Google去吧！