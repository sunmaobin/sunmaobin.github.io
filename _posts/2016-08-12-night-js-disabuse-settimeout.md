---

title: JS解惑-setTimeout
date: 20160812012428
categories: [WEB]
tags: [js]

---

关于 `setTimeout` 的一些理解。

## 背景

js不像java一样拥有sleep的功能，也就是将当前线程暂停一段时间后执行，因为js是基于事件机制工作的，所以它提供了 `setTimeout` 定时任务。

也就是说，如果你要实现一个sleep的功能，那也就只能将sleep后的任务，放到 `setTimeout` 的异步回调函数中执行吧！

本文就简单介绍一下 `setTimeout` 的原理，以及实际工作中的作用。

## 基础

## JS是单线程

为什么js要搞成单线程？而不像java一样可以并发呢？根源在于js前期是嵌套在浏览器中的，而浏览器是直接跟用户打交道，对于人看到的结果而言，如果一次性并行执行多个任务，人！是会凌乱的。

当然，随着 `node.js` 的出现，js多线程不是梦，因为它的出现让大家知道：js不止能跑在浏览器上，还可以用在服务器端。所以，只要在服务器端，那么多线程的事情，终究会解决。虽然现在 `node.js` 全程异步机制已经很高效了！

## JS是基于事件驱动的

为什么这么说呢？其实对于js而言，所以的任务，全部都进入队列，只不过它将当前执行的任务，叫做 `主任务`，而在 `主任务` 中产生的附加的动作全部进入 `任务队列` ，当主线程执行完后，按照 `FIFO` 的原则，依次执行 `任务队列` 中的任务。

其实整个事件处理过程 = Main Task + Event Loop[**注意：**loop其实是个while(true)，一直无线循环]

## setTimeout

 `setTimeout` 的作用，就是改变上面 `任务队列` 中任务的执行顺序的，上文提到，队列中的任务是 `FIFO`(先进先出) 的。但是！！！如果你给这个任务增加延迟时间，那么情况就不一样啦。

也就是说上文提到的 `Event Loop` ，如果其中各任务都是立即执行的，那么按顺序来，如果有延迟，那么你就靠后一点吧。

## 示例

有了上面解释，大家看看两个例子：

**示例1：**

```js
setTimeout(function(){
	console.log('等待2秒执行')
},2000);

console.log('立即执行');

```

结果：

```
立即执行
等待2秒执行
```

解释：

在执行这几行代码时，主任务（Main Task）上只有一行语句：

```js
console.log('立即执行');
```

而开始出现的代码，由于设置了延迟，所以进入任务队列（Event Loop）：

```js
setTimeout(function(){
	console.log('等待2秒执行')
},2000);
```

所以，按照执行顺序 `Main Task -> Event Loop`，结果也就顺理成章了。

**示例2：**

```js
setTimeout(function(){
	console.log('等待2秒执行')
},2000);

while(true){
	console.log('立即执行');
};

```

结果：

```
console.log('立即执行');
console.log('立即执行');
...
```
解释：

由于 `Main Task` 是一个死循环，一直执行不完，所以 `Event Loop`中的任务，就没有机会被执行了。

## setTimeout(fn,0)

为什么要把延迟时间设置为0，单独拿出来说呢？因为这个在实际开发中，很有意义的！

setTimeout的一个作用，就是让其中执行的任务，脱离当前主任务，延后执行，所以 `setTimeout(fn,0)` 的一个作用，就是改变当前任务的执行顺序。

比如上面的 `示例1`，就是活生生的例子。

那么，好奇的你又可能要问题了，好生生的我为什么要改变顺序呢？如果要改，我把2个的顺序提前就调转一下就好了嘛，为什么还要 `setTimeout` 呢，多此一举。

你说的太对了， `setTimeout(fn,0)` 就是解决这个场景的，即：不能改变事件发生的顺序，而又希望事件按需要的顺序发生。

**示例：**

我们都知道，js的2个特征：`事件捕获` 和 `事件冒泡`。

* `事件捕获`，即：事件会先发生在父元素上，最后钻取到子元素上；
* `事件冒泡`，即：事件会先发生在子元素上，最后上升到父元素上；

我们就用 `事件捕获` 来打个比方：

```js
document.onclick = function(){
	console.log('document click!');
};

document.getElementById('myEle').onclick = function(){
	console.log('element click!');
};

```

结果：

```
element click!
document click!
```

当你点击页面上的 `#myEle`元素的时候，必然会最后触发 `'document click!'`，因为 `事件冒泡`。

这时候，如果你希望 `document.onclick` 先执行，因为这里有可能有一些全局的事件过滤机制，就可以这么做：

```js
document.onclick = function(){
	console.log('document click!');
};

document.getElementById('myEle').onclick = function(){
	setTimeout(function(){
		console.log('element click!');
	},0);
};

```

结果：

```
document click!
element click!
```

## 补充

1. setTimeout(fn,2000)，一定会在2s后执行fn函数吗？肯定不会。
	* setTimeout(fn,2000) 的意思是，主任务执行完2s执行任务，首先主任务执行需要耗时吧？而且是在它执行完之后呢！所以，即便主线程执行完任务队列没有其他任务，那么总时间也超过2s了。
1. setTimeout 和 setInterval的区别？
	* 一个是定时执行，一个是定时循环执行。

## 参考

1. [阮一峰：JavaScript 运行机制详解：再谈Event Loop](http://www.ruanyifeng.com/blog/2014/10/event-loop.html)
