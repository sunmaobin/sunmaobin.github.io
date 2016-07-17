---

title: JS解惑-undefined和null
date: 20160717030000
categories: [WEB]
tags: [js]

---

`undefined`和`null`本质上没什么区别，只是用法上代表的含义不一样罢了。

## 前言

为什么说，`undefined`和`null`本质上没什么区别？

通过这个来看看：

```js
undefined == null //true
null == undefined //true
```

另外，再阅读本文之前，建议大家先看看阮一峰老师的博客，以便了解下这二者的历史。

[阮一峰 > undefined与null的区别](http://www.ruanyifeng.com/blog/2014/03/undefined-vs-null.html)

## 定义

* `null`，表示一个“无”的对象；
* `undefined`，表示一个“无”的原始值；

如何理解这2个定义？看看例子：

```js
typeof(null) //object
typeof(undefined) //undefined
```

另外，二者转换为Number的结果也不一样。

```js
Number(null) // 0
Number(undefined) //NAN
```

> NAN，Not a Number，在IEEE浮点数算术标准（IEEE 754）中定义，表示一些特殊数值。
> INF，Infinity的缩写，无穷大的意思，比如：1/0，结果就是Infinity

## 用途

说到这里大家可能就犯迷糊了，你一方面说没什么本质区别，另一方面通过定义又有区别，这让老夫如何是好？

好吧，接下来看看用途你大概就明白为什么Js这么定义二者了。

二者最大的用途不同在于 `阶段不同`：

* `undefined`，用于变量声明时；
* `null`，用于变量赋值时；

我们知道变量的声明和赋值是2个不同阶段，只是有时候我们连起来写罢了，比如：

```js
var name = 'night';
```

这里其实就是声明和赋值一起写了，拆分开来是这样：

```js
var name; // 变量申明
name = 'night'; //变量赋值
```

好了，当您明白了这个逻辑有，再来看看上面说的二者迭代 `阶段不同` 是什么意思。

看看下面的两个例子，你可能就释然了：

```js
var name;
console.log(name); //undefined
name = 'night';
console.log(name); //night
name = null;
console.log(name); //null
```

解释下上面的例子：

* 先定义一个变量，如果变量未赋值，那么就是 `undefined`;
* 如果赋值了，那么 `undefined` 的任务也就完成了；
* 但如果赋值为一个 `null`，那么结果也就是 `null` 了；


说到这里，你可能又会问：“好端端的我赋值一个 `null` 作甚？”

好吧，你是一个充满好奇心的人，且听洒家慢慢道来。

### 关于Null

在Js中，你可以这么归类：“除了基本数据类型外，其余变量全部是对象”。

关于这句话解释下：

* 基本数据类型，包括：undefined,null,number,string,boolean（个人觉得不应有object）
* 所有的函数都可归结为对象（只不过创建对象的函数名遵循首字母要大写罢了）

如果按照这么分类，那么 `null` 的一个作用就凸显了。

给一个变量赋值，基本数据类型可以直接赋值，那么我要赋值一个对象，或者清空一个对象的赋值，该怎么办呢？

那就发面一个空的对象吧，即：`null`。

当然变量被赋值为 `null` 后，还有另一层作用，那就是方便JS引擎对这个变量进行垃圾回收。

在JS中，凡是不用的变量，JS会定期清理掉。当我们把一个对象设置为 `null` 时，其实也就等于把这个对象标记为不用了，可以垃圾回收了。

## 参考

* [http://www.ruanyifeng.com/blog/2014/03/undefined-vs-null.html](http://www.ruanyifeng.com/blog/2014/03/undefined-vs-null.html)
* [http://stackoverflow.com/questions/5076944/what-is-the-difference-between-null-and-undefined-in-javascript](http://stackoverflow.com/questions/5076944/what-is-the-difference-between-null-and-undefined-in-javascript)
* [Mozilla > 垃圾回收](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Memory_Management)




