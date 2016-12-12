---

title: JS解惑-shim、polyfill 和 vanilla
date: 20161212111042
categories: [WEB]
tags: [js]

---

本文将帮助你理解这几个概念：`shim`、`polyfill` 和 `vanilla`。

## shim

是一个小的类库（lib），提供独立的API，以弥补人们在不同的环境下使用原生语言需要考虑兼容性的问题。比如：使用js原生Ajax操作时，你用 `XMLHttpRequest` 创建xhr对象，但是在IE8上，你就得用 `ActiveXObject`，为了解决这些兼容问题，同时简化操作，jQuery出现了。jQuery的核心理念就是： `write less,do more`！

所以，`jQuery` 就可以看成一个 `shim`。

## polyfill

是一个小的类库（lib），用于实现浏览器并不支持的原生API的代码。比如：IE9以下不支持html5新增的一些标签，于是 [`HTML5 shim`](https://github.com/aFarkas/html5shiv) 出现了；当前ES6，以及ES6+的一些语法并未完全普及时，如果你要使用，那么晚了可以使用 [`Babel`](https://babeljs.io/) 来编译成 `ES5` 的语法。

这里注意概念中的一点：`原生API的代码`，指能称得上polyfill的类库，解决方案一定是在不兼容的环境下，重新定义JS本身的语法，不会重新定义API。

比如：IE9以下不支持 `<header>` 标签，`HTML5 shim` 的核心原理就是通过js创建这样一个对象。

```js
//@see [https://github.com/aFarkas/html5shiv/blob/master/src/html5shiv.js](https://github.com/aFarkas/html5shiv/blob/master/src/html5shiv.js)

//line 127
function createElement(nodeName, ownerDocument, data){
    if (!ownerDocument) {
        ownerDocument = document;
    }
    if(supportsUnknownElements){
        return ownerDocument.createElement(nodeName);
    }
	...
}
```

再比如：如果要让IE9以下支持 `XMLHttpRequest`，两种方案：

* `shim` 的解决方案

```js
function getXMLHttpRequest() {
   var xhr = null;

   if (window.XMLHttpRequest || window.ActiveXObject) {
      if (window.ActiveXObject) {
         try {
            xhr = new ActiveXObject("Msxml2.XMLHTTP");
         } catch(e) {
            xhr = new ActiveXObject("Microsoft.XMLHTTP");
         }
      } else {
         xhr = new XMLHttpRequest();
      }
   } else {
      alert("Your browser doesn't support XMLHTTPRequest...");
      return null;
   }

   return xhr;

}
```

* `polyfill` 的解决方案是：

```js
if(!window.XMLHttpRequest){
	window.XMLHttpRequest = xxx;
};
```

参考实现：[https://github.com/LuvDaSun/xhr-polyfill/blob/master/src/XMLHttpRequestProxy.js](https://github.com/LuvDaSun/xhr-polyfill/blob/master/src/XMLHttpRequestProxy.js)

## shim 和 polyfill

* `shim` 和 `polyfill` 的目的都是为了解决浏览器兼容性，并且给大家提供方便的，这也是类库（lib）的一个作用；
* `shim` 包含了 `polyfill`，范围更广，可以重新定义API，而 `polyfill` 相对狭义一些，API的使用上一定是JS标准；

## vanilla

> 这个概念一般说的少一些，了解下就可以了。

在计算机软件领域中，如果你对原生系统没有做任何定制性的修改，就是Vanilla。

比如，这个网站就跟我们开了个玩笑：[http://vanilla-js.com/](http://vanilla-js.com/)，下载下来是空的，其实看域名就知道了，作者建议你使用原生API!

## 参考

1. [https://en.wikipedia.org/wiki/Shim_(computing)](https://en.wikipedia.org/wiki/Shim_(computing))
1. [https://en.wikipedia.org/wiki/Polyfill](https://en.wikipedia.org/wiki/Polyfill)
1. [https://segmentfault.com/a/1190000002593432](https://segmentfault.com/a/1190000002593432)
1. [https://www.zhihu.com/question/22129715](https://www.zhihu.com/question/22129715)



