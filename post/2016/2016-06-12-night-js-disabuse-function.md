# JS解惑-function前面有+和!等特殊字符

让一个函数页面加载后就运行（专业术语叫：[IIFE](https://en.wikipedia.org/wiki/Immediately-invoked_function_expression)），你的脑海中能想出几种办法呢？

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

> 2017年3月29日21:05:26 修正和补充以下内容。

比如：`!function autoFun(){}(); ` 可以这么理解：

* 第一步：function autoFun(){}; //函数表达式
* 第二步：!autoFun(); //执行函数，并将结果求反（!）

之所以这么连起来，最主要的问题是以下这种写法是错误的：

```js
function autoFun(){}();
```

因为受JS语法解析器的影响，函数的定义和执行不能同时进行的。

但是！如果是一个表达式，那么JS语法解析器会走另外的处理流程，这个流程就是上面提到的2步。

当然，只要是表达式就可以，所以函数的定义不行，但是函数的申明就是可以的：

```js
var autoFun = function(){}();
```

这么写的结果就是function会执行，但是autoFun=undefined；原因是这时候autoFun的值等于function执行的结果，由于function是个空方法里面没有return值，所以结果就是未定义。
当然，你这么写的目的，可能只是为了快速执行function，所以最后的autoFun的结果你并不关心，那就无所谓了。

具体哪些操作符，可以达到这个目的，参考：[IIFE](https://en.wikipedia.org/wiki/Immediately-invoked_function_expression)

另外，如果不知道 `函数申明` 和 `函数表达式` 的，请自行Google去吧！

## 参考

* [function与感叹号](http://swordair.com/function-and-exclamation-mark/)
* [IIFE](https://en.wikipedia.org/wiki/Immediately-invoked_function_expression)