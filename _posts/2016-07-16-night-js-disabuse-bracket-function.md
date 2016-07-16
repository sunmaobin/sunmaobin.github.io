---

title: JS解惑-()表达式的含义
date: 20160716050413
categories: [WEB]
tags: [js]

---

JS中经常能看到 `(function(){...})()`，那么双括号()到底是什么意思呢？

## 背景

我们先来看看一些实际工作中用到的()的例子。

形式是这样的：

```
(function(){
    //TODO
})();
```

当然在jquery中，有时候为了避免变量$冲突，也经常这么用：

```
jQuery.noConflict();
(function($){
    //TODO
})(jQuery);
```

## 分析


引自 `Ecma-262` 第 `12.2.10.4章节` 的语句：

```
ParenthesizedExpression : ( Expression ) 
   1. Return the result of evaluating Expression. This may be of type Reference.
```

我个人的理解翻译：

```
圆括号括起来的表达式：(表达式)

返回计算表达式的结果，这可能是一个引用。
```

**返回计算表达式的结果**

这句话怎么理解呢？举个例子：

```js
(function(){
    console.log(123456);
});
```

结果就是这个function的函数表达式，即：

```js
function(){
    console.log(123456);
}
```

如果上的例子，后面再加一个()，那么就是立即执行这个函数，即：

```js
(function(){
    console.log(123456);
})();
```

结果：123456

引申：

写到这里大家可能会问，为什么要这么用呢？

当然，至少有2个作用：

* 立即执行函数，即：self-executing anonymous function
* 构建独立不受污染的作用域

关于立即执行函数，参考我之前写过的一片文章：

* [JS解惑-function前面有+和!等特殊字符](http://www.night123.com/2016/night-js-disabuse-function/)

另外，我们知道JS在ES6之前是没有块级作用域的，那么通过这种 `(匿名函数)` 的形式，可以保证 `()` 函数中拥有独立的作用域，而外部无法访问。


**这可能是一个引用**

这句话怎么理解呢？举个例子：

```js
var obj = {
    name : 'night',
    sayHi : function(){
        console.log('hello ' + this.name);
    }
};
(obj);
```

结果就是这个obj的对象本身（也就定义中说的，是对obj的引用）：

```js
Object {name: "night"}
    name:"night"
    sayHi:()
    __proto__:Object
```

既然是这样，那么以下语句结果就不言而喻了吧：

```js
(obj.sayHi)();//hello night
//注意：(obj.sayHi())()，是不正确的哦！！！
//因为(obj.sayHi)本身就返回了一个应用对象哦，不能在()里面直接就运行哦，那你要()就没用了。
```

我还是分析下吧：

* (obj) = obj;//即，对obj的引用
* (obj.sayHi) = obj.sayHi();//即，调用对象自己的sayHi方法

引申：

`JavaScript 高级程序设计（第三版）` 的 `7.2.2 关于this对象` 中有个例子，看了以上概念，大家肯定更好理解了。

例子在这本书的 `P183页` 最终结果：My Object，大家自己去看。

## 结论

`(expression)` 的理解：

* 返回计算表达式的结果
* 返回一个引用

`(expression)()` 的作用：

* 立即执行函数
* 构建独立不受污染的作用域

## 参考

1. [Ecma-262](http://www.ecma-international.org/publications/files/ECMA-ST/Ecma-262.pdf)
1. http://stackoverflow.com/questions/4043647/what-does-this-function-a-function-inside-brackets-mean-in-javascript
1. http://stackoverflow.com/questions/440739/what-do-parentheses-surrounding-a-javascript-object-function-class-declaration-m

