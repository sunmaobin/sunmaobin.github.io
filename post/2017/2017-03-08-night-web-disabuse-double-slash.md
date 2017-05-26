# WEB解惑-URL双斜杠开头//

大家有没有发现，在一些免费的CDN站点提供的JS或者CSS的路径都是以 `//` 开头的？

比如：

```html
<link href="//cdn.bootcss.com/bootstrap/4.0.0-alpha.6/css/bootstrap.css" rel="stylesheet">
```

## 概念

`//` 开头的资源地址，其实专有名词叫：`Protocol-relative URL`，也就是：`相对协议URL`。

提起相对协议URL，其实我们实际中也经常用到，大家常见的有：

* **Absolute** http://www.example.com/images/icons.png
* **Document-Relative** ../images/icons.png
* **Root-Relative** /images/icons.png
* **Protocol-Relative** //www.example.com/images/icons.png

## 作用

这么书写的作用就是：浏览器在请求资源时会依据当前页面的协议头来决定加载资源的协议头。

比如：当前页面是 `https` 开头的，那么依赖的这个文件就会以 `https` 协议去加载，否则使用 `http`加载。

## WHY

为什么要这么做呢？不是js和css可以随便引入吗？为啥还要分协议呢？我统一使用 `http` 开头来加载资源有啥问题呢？

* 如果你的站点就是 `http` 的，那么没一点问题。

* 如果你的站点是 `https` 的，那么默认是不建议引入 `http` 的资源的，资源包括：js、css、图片等。在Chrome、Firefox等浏览器下，控制台会打印警告！而在一些版本的IE浏览器下，会弹出如下警告：

	![](http://i.imgur.com/byOlTd8.gif)

* 如果你引入的 `http` 资源中又引入了别的资源，会直接被浏览器决绝掉，提示：跨域请求失败的错误信息。
	* 比如：JS中动态创建JS；
	* 比如：CSS中通过font-face引入字体；

	![](http://i.imgur.com/b4lm4vf.png)

## 解决方案

知道了为什么会出现这个问题，那么我们经常引入一些外部资源的时候，就会有以下常见的办法。

* 使用上面提到的 `Protocol-relative URL` 双斜杠的办法，让浏览器自动匹配，但是这种方法可能有兼容性问题，比如在IE6上，或者一些比较特殊的WEB容器中，就无法解析，这时候的处理办法，可以参考：

```html
<!-- 优先取得CDN上的资源 -->
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.js"></script>

<!-- 如果CDN资源获取失败，则动态加载本地资源 -->
<script>!window.jQuery && document.write(unescape('%3Cscript src="js/libs/jquery-1.4.2.js"%3E%3C/script%3E'))</script>
```

* 判断当前页面的 `protocol` 动态加载js，比如：

```html
ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
```

这两种方法现在都比较常用，第一种一般用在CDN资源的引入上，而第二种一般用在第三方脚本引入上。比如：Google分析、百度分析、多说评论框等等，引入一段脚本的时候都会这么做。

比如，大家看看多说评论框的JS脚本：

```html
<!-- 多说评论框 start -->
<div class="ds-thread" data-thread-key="请将此处替换成文章在你的站点中的ID" data-title="请替换成文章的标题" data-url="请替换成文章的网址"></div>
<!-- 多说评论框 end -->
<!-- 多说公共JS代码 start (一个网页只需插入一次) -->
<script type="text/javascript">
var duoshuoQuery = {short_name:"your name"};
(function() {
	var ds = document.createElement('script');
	ds.type = 'text/javascript';ds.async = true;
	ds.src = (document.location.protocol == 'https:' ? 'https:' : 'http:') + '//static.duoshuo.com/embed.js';
	ds.charset = 'UTF-8';
	(document.getElementsByTagName('head')[0] 
	 || document.getElementsByTagName('body')[0]).appendChild(ds);
})();
</script>
<!-- 多说公共JS代码 end -->
```

## 推荐直接用HTTPS

那为什么不直接进入 `https` 的资源呢？

其实是可以的！只是以前，人们一直以为 `https` 协议请求相对来说比较耗时，所以大家一般都不用，或者有些资源网站也不支持 `https`。

但是现在技术发展挺快，`https` 也已经很稳定、高效，并且最关键的一点，在 `http` 网站中引入 `https` 是可以的！

所以，如果你现在引入资源的话，建议直接引入 `https` 的资源（如果支持），而且 `https` 网站也是趋势！

## 延伸

反过来看待上面的 `//` 的这种做法，许多人这么评价： `protocol-relative URLs are an anti-pattern`，翻译过来就是：`相对协议URL是一种反模式`。

意思就是说：其实 `HTTPS` 才是大势所趋，我们应该鼓励直接用 `HTTPS`，而不是妥协它做一些兼容性的解决方案。

比如这篇文章的观点：[Moving CDNs to HTTPS](https://github.com/konklone/cdns-to-https#conclusion-cdns-should-redirect-to-https)

## 参考

* [The Protocol-relative URL](https://www.paulirish.com/2010/the-protocol-relative-url/)
* [Wikipedia:Protocol-relative URL](https://en.wikipedia.org/wiki/Wikipedia:Protocol-relative_URL)
* [Types of URLs](http://stackoverflow.com/questions/743247/types-of-urls)
* [https 页面中引入 http 资源的解决方式](https://segmentfault.com/a/1190000004200361)
* [Optimizing the asynchronous Google Analytics snippet](https://mathiasbynens.be/notes/async-analytics-snippet#protocol-check)
* [Moving CDNs to HTTPS](https://github.com/konklone/cdns-to-https#conclusion-cdns-should-redirect-to-https)

（全文完）
