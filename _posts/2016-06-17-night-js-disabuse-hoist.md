---

title: JS解惑-hoist-函数OR变量提前
date: 20160617082845
categories: [WEB]
tags: [js]

---

JavaScript中，函数OR变量提前（Hoist）是什么意思？它在Js中发挥着什么作用呢？本文结合自身经验来解释下这个概念。

其实要说这个概念，需要用到很多JS的概念，如果本文中未讲解的，建议大家先弄懂这些概念。

## 一、定义

Hoist，[跟我读：好意思特]，升起、吊起的意思。

在JS中的解释是：在作用域（Scope）内变量或者函数会提前到作用域顶部执行。

示例：

```js

// step 1
var myvar = 'my value'; 
alert(myvar); // my value

// step 2
var myvar = 'my value'; 
  
(function() { 
  alert(myvar); // my value 
})();

// step 3
var myvar = 'my value'; 
  
(function() { 
  alert(myvar); // undefined 
  var myvar = 'local value'; 
})();

```

示例解释：

* `step 1` ，在全局作用域（Global）范围内，定义变量并初始化，再alert，正常显示。
* `step 2` ，在`（）`的包含的匿名函数的作用域内，alert变量myvar，由于当前作用域未定义变量myvar，于是js解析器，会沿着原型链（[ScopeType]）继续向其指向的父类的原型函数（Prototype）寻找，而父类是window，其中定义的所有变量默认都在其原型函数上，找到了，于是正常显示。
* `step 3` ，这里使用到了JS的另一个概念（变量提前），下文解释这个问题。

扩展阅读：

1. [JavaScript中圆括号() 和 方括号[] 的特殊用法疑问？](https://www.zhihu.com/question/20127472)
1. JavaScript 其它几个概念：作用域、原型链、原型函数、匿名函数等，自行Google，基础知识，当然我的后续文章也会分析讲解。

## 二、求解

我们通过 `Hoist` 的定义可以知道，在作用域范围内，变量和函数提前执行，那么上题可以变形为：

```js
var myvar = 'my value'; 
  
(function() { 
  var myvar;
  alert(myvar); // undefined 
  myvar = 'local value'; 
})();
```

而我们知道JS在当前作用域内是自上而下顺序执行的。所以，当执行到alert的时候，myvar还未初始化，所以结果就是undefined。

这里其实有2个隐身概念，即：

1. JS对函数解析执行的顺序；
1. 变量定义和变量初始化；

本节就说到这里，下节继续烧脑。

## 三、探秘

首先针对上节遗留2个问题，进行回答。

### 3.1 JS对函数解析执行的顺序

记忆中应该是这个样子，如果有问题，欢迎指正。

1. 为该函数构建执行的作用域（又叫上下文）；
1. 为该函数分配this和arguments参数；
1. 变量和函数提前执行；
1. 剩余代码分块执行；

### 3.2 变量定义和变量初始化

先解释下这2个概念的专业术语：

* 变量定义，Declaration
* 变量初始化，Initialization

示例：

```js
var myvar = 'my value'; 
```

解释：

其实以上代码，在JS内部可是执行了2步，即：先定义，再初始化。   
以上代码在JS内部执行的时候，是将定义和初始化分开执行：

```js
var myvar;
myvar = 'my value';
```

## 四、升华

在上文中有个细节，我一直提起，就是：变量和函数提前。   
我们知道函数其实也有两种（不止）定义方式：函数申明和函数表达式。

其中，函数表达式，又分为：匿名函数表达式 和 函数表达式。

顺便补下基础：

```js
//函数声明
function functionName(arg1, arg2){
    //function body
}

//匿名函数表达式（常用的）
var functionName = function(arg1, arg2){
    //function body
};

//函数表达式
var functionName = function functionNameIgnored(arg1, arg2){
    //function body
};

```

那对于 `函数申明` 和 `函数表达式` 是不是都会提前呢？看下例子。

```js
foo(); // TypeError "foo is not a function"
bar(); // valid
baz(); // TypeError "baz is not a function"
spam(); // ReferenceError "spam is not defined"

//匿名函数表达式，foo会被hoisted
var foo = function () {}; 
//函数申明，bar和函数体都会被hoisted
function bar() {}; 
//函数表达式，只有baz会被hoisted，spam就当没看见，因为解析器解析时会忽略这个无用变量
var baz = function spam() {}; 

foo(); // valid
bar(); // valid
baz(); // valid
spam(); // ReferenceError "spam is not defined"

```

补充说明下：

1. 函数表达式，再未初始化之前，就当成是一个普通的变量定义而已，没有任何状态、类型，就是undefined；
1. 函数申明，函数定义和函数体都会被提前执行；
1. 函数表达式中，如果不是匿名函数，那么js解析器也会忽略这个无用函数变量，所以上面的例子中，即时函数都初始化完毕，最后执行spam()，依然会报错，因为这个变量就相当于没有。

## 五、扩展

上文中提到了作用域（Scope）,这里总结一个知识点，就是一个变量进入作用域的4种方式：

1. JS默认的2个变量（this和arguments），函数初始化就存在，会自动进入作用域；
1. 作为正常的参数，如function（arg1），这里的arg1在函数执行时就进入了当前函数作用域；
1. 函数申明，如function myfun（），这里myfun以函数的形式进入了全局作用域；
1. 变量申明，如var obj，这里obj就进入了当前作用域；

## 六、习题

好了，所有概念全部梳理完了，以下经常在面试中出现的习题，大家不放围观下。

1、开篇的题目

```js
var myvar = 'my value'; 
  
(function() { 
  alert(myvar);
  var myvar = 'local value'; 
})();
```

答案：undefined

2、触类旁通

```js
var x = y, y = 'A';
console.log(x + y);
```

答案：undefinedA

分析：

这个题目，如果大家按照变量hoist的方式拆分下，可能就明白了。

```js
var x;
var y;
x = y;//初始化x的时候，y还是undefined
y = 'A';
console.log(x + y);
```

3、再补充一个

```js
var x = 0;

function f(){
  var x = y = 1;
}
f();

console.log(x, y);
```

答案：0, 1

分析：

我们要牢记hoist是在当前作用域内被提前。

```js
var x = 0;

function(){
    var x;//当前作用域内定义x
    x = y;//由于测试y未定义，所以当前作用域内的x=undefined，脱离当前作用域，别的地方获取的还是全局的x
    y = 1;//由于y之前未添加var，其实相当于：window.y = 1，是全局变量，所以下方能访问到
}
f();
console.log(x, y);

```

## 七、参考

1. [http://www.adequatelygood.com/JavaScript-Scoping-and-Hoisting.html](http://www.adequatelygood.com/JavaScript-Scoping-and-Hoisting.html)
1. [https://www.nczonline.net/blog/2010/01/26/answering-baranovskiys-javascript-quiz/]()
1. [https://developer.mozilla.org](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/var#变量声明提升（var_hoisting）)
1. [http://code.tutsplus.com/tutorials/javascript-hoisting-explained--net-15092](http://code.tutsplus.com/tutorials/javascript-hoisting-explained--net-15092)



