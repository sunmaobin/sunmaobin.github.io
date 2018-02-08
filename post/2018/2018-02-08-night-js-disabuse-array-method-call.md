# js解惑-Array.[method].call有什么作用

## 背景

最近在项目中，看到有同事写一个数组的方法的时候，习惯性的用以下写法：

```js
* [].forEach.call(array,fn);
* [].map.call(array,fn);
* [].sort.call(array,fn);
...
```

我的第一个想法是，为啥对于一个数组不直接写成：

```js
* array.forEach(fn)
* array.map(fn)
* array.sort(fn)
```

询问其原因后，同事的说法是：`在有些书上说过，这么写保险，保证数组的方法万无一失可以调用，不报错`。

## 观点

同事的出发点没错，就是保证书写代码的健壮性。但我个人的观点是，这种不管三七二十一统一都调用 `.call` 来保证功能可用的方法，在一定程度上，牺牲了代码的可读性，同时给代码增加了一些冗余。

为什么这么说呢？我们先看看同时的这个 `万无一失` 的担忧在哪里。

## 问题

我们知道在js中有一种结构叫：类数组（`array-like`），这是怎么样的一种结构呢？就是：`表现形式上像数组，但是却没有数组的方法。`

比如：

* 在函数体内有个参数 `arguments` 就是获取所有的参数，这个参数获取的结果像是一个数组，但是却没有数组的方法。

![](https://i.imgur.com/7e3gdOM.jpg)

* 在老的浏览器中，使用方法 `document.querySelectorAll` 获取到所有Dom节点，如果要遍历，就不能直接使用数组forEach方法（`最新的Chrome、Firefox已经不存在这个问题了`）。

![](https://i.imgur.com/DpN4mnc.jpg)

## 结论

综上所述，只有我们遇到 `类数组` 的时候，再调用数组的 `.call` 将类数组转换为一个真正的数组，然后使用数组提供的方法。如果我们明确知道这就是一个数组，就没必要再 `call` 转换一次了，实在影响代码可读性。

## 基本功

* `call` 和 `apply` 都算是继承的一种写法，`[].map.call(a1,fn)` 就是将数组的map方法继承给a1，并且调用这个map方法； 
* `[].map.call` 和 `Array.prototype.map.call` 是相同的，几乎没啥差异，性能上也差不多，见[这里](https://jsperf.com/array-map-call-vs-array-prototype-map-call)的测评；
* 同上我们常用的 `Object.prototype.toString.call` 也可以写成 `({}).toString.call`，都是可以的，只所以写成 `({})` 是由于不写的话，就成了 `}.` 而不是对象 `{}`；

![](https://i.imgur.com/x02Lwti.jpg)

