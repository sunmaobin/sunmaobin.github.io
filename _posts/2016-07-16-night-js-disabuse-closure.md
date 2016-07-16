---

title: JS解惑-闭包（closure）
date: 20160716075837
categories: [WEB]
tags: [js]

---

对于JS的闭包（Closure）的概念，以及闭包的作用域具有全局性。我针对我自己的实战感受，这里简单谈谈。

## 概念

闭包（Closure），是指有权访问另一个函数作用域中的变量的函数。

创建闭包，常见的一种方式就是在一个函数内部创建另一个函数。

> 概念引自：`JavaScript 高级程序设计（第三版）` 中 `7.2 闭包` 一节，`178页`。

## 示例

举个例子来解释下这个概念：

```js
var name = 'window';
function outerFun(){
    var name = 'night';
    console.log('1',this.name);
    var innerFun = function(){
        console.log('2',name);
        console.log('3',this.name);
    };
    return innerFun;
};

outerFun()();

结果：

1 window
2 night
3 window
```

## 分析

示例代码在执行的时候，可以进行如下分解：

```js
var name = 'window';
var fun1 = outerFun();
var fun2 = fun1();//fun2是fun1的闭包
fun2();//最终调用
```

再来继续加工下：

```js
window.name = 'window';
window.fun1 = window.outerFun();
window.fun2 = window.fun1();//fun2是fun1的闭包
window.fun2();//最终调用
```

为什么能这么变形呢?因为在最外层，其实所有变量都是window对象的！

经过上面的分解，我们知道最终调用 `fun2()` 的时候，其实fun2函数，已经相当于是window环境了。

所以，我们知道任何闭包，都是最终都相当于在window环境下执行的，这也就是为什么闭包的作用域具有全局性了。

## 深究

接下来再来看单独拆分下每个函数：

### `fun1`的函数：

```js
var name = 'window';
function fun1(){
    var name = 'night';
    console.log('1',this.name);
}
```

为什么 `fun1` 中的结果是：window 而不是 night？

知识点：

1. 我们知道，任何一个函数在执行的时候，首先会为其创建一个上下文环境，接着初始化2个变量：`this` 和 `arguments`，fun1中的this（调用它的对象，也叫活动对象），即：window
1. `全局作用域` 和 `局部作用域` 的最大区别就是，局部作用域在函数内部定义，并且在非闭包的情况下，函数运行完毕就释放掉了。

所以：

`console.log('1',this.name);`其实就是在window中寻找 `name` 属性，这个肯定是 `window` 了，因为在函数之前，我们定了 `var name`= `window.name`。

至于 `fun1` 中的 `name` 其实在函数中，根本就没有被使用，而如果我们不明确指定 `this.name`，即：

```js
var name = 'window';
function fun1(){
    var name = 'night';
    console.log('1',name);
}
```

那么结果肯定是：night，再如果fun1内部未定义name，那么最终还是会通过原型链（或者叫上下文）找到全局的name。


### `fun2`的函数：

```js
function fun2(){
   console.log('2',name);
   console.log('3',this.name);
}
```

fun2所处的活动对象其实有3个：

1. 自身函数
1. fun1函数
1. window函数

`console.log('2',name);` 会优先从内部寻找 `name` 变量，没找到！那么就从为其提供闭包的父函数 `fun1` 中找，找到了，即：night

`console.log('3',this.name);` 这里明确指定了 `this.name` 那么，系统就会从原型链开始寻找 `this.name` ，由于 `this` 指向的是 `window` ，那么结果自然就是：window

## 扩展

其实闭包函数，在我们的日常工作中经常用到。

### 定义对象过程中经常会涉及到

```js
//通过字面量定义一个对象obj
var obj = {
    name : 'night',
    bindEvent : function(){
        var _self = this;
        $('#btn').click(function(){
            console.log('hello ' + _self.name);
        });
    }
};
```

### 方法中包含setTimeout

```js
//3s后显示：hello night
function delayDisplay(){
    var name = 'night';
    setTimeout(function(){
        console.log('hello ' + name);
    },3000);
};
```

其实，还有很多这方面的例子，但是不管怎么样，你要记住一个概念：函数中的函数。

而且闭包有一个优势：就是能访问创建闭包对象的变量。



