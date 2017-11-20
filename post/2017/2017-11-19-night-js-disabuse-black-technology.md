# JS解惑-那些经常用但是又叫不起名字的知识

## Vanilla JS

世界上最轻量的 `JavaScript` 框架！

* http://vanilla-js.com/
* https://segmentfault.com/a/1190000000355277
* https://github.com/sunmaobin/sunmaobin.github.io/issues/29

## 字面量（Literal Syntax）

字面量就是变量创建的一种简写方式。

```js

var test = new String("hello world!");
var test = "hello world!";

var ary = new Array();
var ary = [];

```

## 匿名函数（Anonymous Function）

```js

//eg1: 函数定义
var fun1 = function(){};

//eg2: 立即执行函数
(function(){
	//...
})();

```

## 三元表达式（Conditional (ternary) Operator）

```
condition ? expr1 : expr2 
```

```js
//示例
var str = ture ? 'yes' : 'no';
```

## `OR` 操作符 `Short-Circuits`

* `||` is the or operator short-circuits。

```
//If exp1 is true then exp2
exp1 || exp2
```

```js
//传统写法
var a = "something";
if(condition){
	a = condition;
};

//Short-Circuits
var a = condition || "something";
```

> 只所以可以这么写，原因是js是一门弱类型语言，每个变量默认都默认继承一个 `true` 或者 `false` 值，称之为：`truthy` 或者 `falsy`！

* https://www.sitepoint.com/javascript-truthy-falsy/

## 立即执行函数（IIFE）

即函数的定义和执行同时进行。

* `IIFE` - Immediately Invoked Function Expression

* 首尾加括号包裹函数体

```js
(function(){
console.log('here');
}());
```

* function外面加括号

```js
(function(){
console.log('here');
})();
```

* function前面加运算符

```js
!function(){
console.log('here');
}()
```

或者

```js
void function(){
console.log('here');
}()
```

* https://blog.mariusschulz.com/2016/01/13/disassembling-javascripts-iife-syntax
* https://github.com/sunmaobin/sunmaobin.github.io/issues/15

## 尾逗号（Trailing Comma）

```js
{
    "id" : 1,
    "name" : "张三", // 注意这个逗号！
}
```

## UMD

```js
// Uses CommonJS, AMD or browser globals to create a jQuery plugin.

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = function( root, jQuery ) {
            if ( jQuery === undefined ) {
                // require('jQuery') returns a factory that requires window to
                // build a jQuery instance, we normalize how we use modules
                // that require this pattern but the window provided is a noop
                // if it's defined (how jquery works)
                if ( typeof window !== 'undefined' ) {
                    jQuery = require('jquery');
                }
                else {
                    jQuery = require('jquery')(root);
                }
            }
            factory(jQuery);
            return jQuery;
        };
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    $.fn.jqueryPlugin = function () { return true; };
}));
```

* https://github.com/umdjs/umd/blob/master/templates/jqueryPlugin.js
* https://github.com/umdjs/umd

> 参考对比：CMD、AMD

## 相对协议URL（Protocol-Relative URL）

翻译成中文可以称之为：`相对协议URL`，即：省略路径前面的具体协议名，只保留 `//`。

* 示例：

```html
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.js"></script>
```

## TypeScript

`TypeScrip`t 是 `JavaScript` 的类型的超集，它可以编译成纯 `JavaScript`，编译出来的 `JavaScript` 可以运行在任何浏览器上，`TypeScript` 编译工具可以运行在任何服务器和任何系统上。

```js
//TypeScript 语法
class Greeter {
    greeting: string;
    constructor(message: string) {
        this.greeting = message;
    }
    greet() {
        return "Hello, " + this.greeting;
    }
}
```

```js
//JavaScript 语法
var Greeter = (function () {
    function Greeter(message) {
        this.greeting = message;
    }
    Greeter.prototype.greet = function () {
        return "Hello, " + this.greeting;
    };
    return Greeter;
}());
```

* https://github.com/Microsoft/TypeScript
* https://ts.xcatliu.com/introduction/what-is-typescript.html

（全文完）
