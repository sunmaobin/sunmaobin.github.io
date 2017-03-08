---

title: font-face引用字体跨域
date: 20170308150612
categories: [WEB]
tags: [CSS 跨域]

---

我们知道页面直接进入CSS文件是不存在跨域问题的，但是有没有遇到过CSS中依赖的字体会存在跨域问题？

## 问题

比如，现在矢量小图标非常流行，也有一些开源的矢量图库让你用，比如我们将 `font-awesome` 这个CSS部署到一台服务器上，在另一台服务器访问。

如：我们在 `y.domain.com` 地址中请求 `x.domain.com` 的这个资源。

```html
<link href="//x.domain.com/font-awesome/4.7.0/css/font-awesome.css" rel="stylesheet">
```

你会看到类似的跨域的错误：

![](http://i.imgur.com/59cJ7z4.png)

## 原因

`font-awesome.css` 依赖了字体文件：

```css
@font-face {
  font-family: 'FontAwesome';
  src: url('../fonts/fontawesome-webfont.eot?v=4.6.3');
  src: url('../fonts/fontawesome-webfont.eot?#iefix&v=4.6.3') format('embedded-opentype'), url('../fonts/fontawesome-webfont.woff2?v=4.6.3') format('woff2'), url('../fonts/fontawesome-webfont.woff?v=4.6.3') format('woff'), url('../fonts/fontawesome-webfont.ttf?v=4.6.3') format('truetype'), url('../fonts/fontawesome-webfont.svg?v=4.6.3#fontawesomeregular') format('svg');
  font-weight: normal;
  font-style: normal;
}
```

原因就在这里了， `font-face` 本身是有跨域问题的！

也就是说，使用 `font-face` 所使用的字体一定要与当前页面在同一个域下，要么就看下面的解决办法。

## 解决

解决方案，就是使用 [HTTP access controls](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS) 来处理。

具体办法，就是将部署当前CSS的服务器做跨域支持，比如对于Apache的 `.htaccess` 中增加以下配置：

```xml
AddType application/vnd.ms-fontobject .eot
AddType font/truetype .ttf
AddType font/opentype .otf
AddType font/opentype .woff
AddType image/svg+xml .svg .svgz
AddEncoding gzip .svgz
<FilesMatch "\.(ttf|otf|eot|woff|svg)$">
	<IfModule mod_headers.c>
	      Header set Access-Control-Allow-Origin "*"
	</IfModule>
</FilesMatch>
```

如果你是其它的服务器，那么请自行处理下字体资源的跨域问题就行了。

## 参考

* [Cross-domain font-face issues](http://stackoverflow.com/questions/8245464/cross-domain-font-face-issues)
* [MOZILLA @font-face](https://developer.mozilla.org/zh-CN/docs/Web/CSS/@font-face)
* [HTTP access controls](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS)

（全文完）
