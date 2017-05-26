# HTML解惑-href属性的特殊用法

针对HTML中href的一些特殊用法的解惑。

## 一、A标签的用法

### 1、跳转到另一个目标地址

```html

<a href="http://www.night123.com">跳转到Night博客</a>

```

### 2、跳转到当前文档的固定章节

指定一个 `hash` 值，跳转到当前文档 `id=hash` 所在的位置。

比如：在 `<body>` 有如下标签。

```html

<!-- 案例展示 -->
<div id="cases">
	...
</div>

```

在 页面中间一个超链接，点击后定位到 `cases` 所在位置，则可以增加一个 `a` 标签操作。


```html

<p>
	<a href = "#header">查看案例</a>
</p>

```

### 3、调用系统默认邮件系统发送邮件

```html

<a href="mailto:ismb@qq.com?Subject=hello%20night">发送邮件</a>

```

### 4、执行 JavaScript 脚本

```html

<a href="javascript:alert('Hello World!');">运行JS</a>

```

## 二、href 属性特殊用法解惑

我们通过以上章节，知道了 `a` 标签的功能，但是在实际工作中，还有一些特殊用法，接下来我将一一为你解惑。

### 1、href="#"

这个本来正常的做法，是 `href="#hash"`，但是偏偏只有一个 `#`，用意何在？

作用有2个：

1、跳转到顶部

```html

<a href="#">返回顶部</a>

```

2、保留 `href` 默认样式的情况下，不使用默认的跳转功能

有时候为了业务需要跳转功能是通过 `js` 来控制，这样我们就需要屏蔽 `href` 的默认跳转，这时候我可能会这么做。

* 去掉 `href` 属性，但是去掉后，发现浏览器默认的 `a` 标签样式没了，鼠标滑过也没有手的形状，一切都得重置，麻烦。
* `href="#"` 点击后，继续在当前页面，后续逻辑交给 `js` 处理，但是这么处理后，假如 `a` 标签在页面底部，页面有滚动条，这时候，点击以后页面会先返回顶部，再执行js的操作。所以，这么做体验也还是不好。

当然，有时候我们在页面的 `menu` 里面，也可能会有一些 `a` 标签，用来定位跳转到不同的页面，如：


```html

<ul class="nav">
	<li><a href="#">首页</a></li>
	<li><a href="#">案例</a></li>
	<li><a href="#">关于</a></li>
</ul>

```

如果这个 `nav` 在页面顶部，只要不是需要拖动滚动条的地方，那么点击后，使用 `js` 处理跳转页面几乎没感觉。唯一有一点点小的瑕疵，就是在地址栏上的href后面，会多出一个 `#`。

比如，之前的地址是：[http://www.night123.com/index.html](http://www.night123.com/index.html)

那么点击任何一个 `a` 标签后，页面会变成：[http://www.night123.com/index.html#](http://www.night123.com/index.html#)

现在知道了 `href="#"` 的两个作用了吧，虽然这2个作用在解决相关问题，都不是很完美，但是还是有一些人一直在用。

> 补充说明，有人说 `href` 是 `a` 标签必不可少的一个属性，其实不然。
> 延伸阅读请参考：[http://w3c.github.io/html/links.html#attr-hyperlink-href](http://w3c.github.io/html/links.html#attr-hyperlink-href)

### 2、href="javascript:;"

这种用法，现在也很常见，目的也是解决避免默认的 `href` 跳转的。

但是这种做法就比上面第一种做法要好，因为这么做相当于是执行了一个空的 `js` 片段，这样在页面的任何位置点击 `a` 标签后，原页面本身都是无感知的。

当然这个做法也还不是最好的，因为从功能上完全实现，体验上也没有问题，但是从写法上，总是有些怪异。比如：`javascript:;`，不是越看越不好理解吗？


当然要避免这种问题，可以使用js原生的事件机制，来屏蔽原始的事件，方法如下：

方法1：

```js

<a id="click" href='#'>Click Me!</a>

<script>
document.getElementById("click").onclick  = function(e){
	// 屏蔽原始事件
    	e.preventDefault();

	// TODO: 实现自己的业务逻辑

}
</script>

```

或者使用另一种做法：

```js

<script>
document.getElementById("click").onclick  = function(e){

	// TODO: 实现自己的业务逻辑

	// 阻止事件传递
	return false;
}
</script>

```

参考：[stackoverflow激烈讨论](http://stackoverflow.com/questions/134845/href-attribute-for-javascript-links-or-javascriptvoid0)

个人觉得方法一是最完美的处理方式。


### 3、href="javascript:void(0);"

这是禁止页面跳转的一种方式。

看了这篇文章就知道了：
[谈谈Javascript中的void操作符](https://segmentfault.com/a/1190000000474941)


### 4、href="#!home"

此种写法在 `SPA` 应用中最为常见，原理就是通过监听js的 `onStateChange` 事件，来控制路由规则，加载不同的HTML模板，实现页面切换。

但是浏览器地址中的的 `hash` 不是 `#` 后面的参数吗？为什么要增加一个感叹号，不能直接这么写 `#home` 吗？


看看阮一峰大神的这篇文章，就明白了:
[URL的井号](http://www.ruanyifeng.com/blog/2011/03/url_hash.html)

