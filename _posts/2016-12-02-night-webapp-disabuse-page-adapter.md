---

title: 移动端H5解惑-页面适配（二）
date: 20160701125435
categories: [WEB]
tags: [mobile]

---

关于移动端WEB页面适配问题，如何处理？

## 基础概念

[移动端H5解惑-概念术语（一）](http://www.night123.com/2016/night-webapp-disabuse-page-concept/)

## 为什么要适配

## PC端为什么要解决浏览器兼容

因为在PC端，由于浏览器种类太多啦，比如几个常用的：IE、火狐、Chrome、Safari等。同时，由于历史原因，不同浏览器在不同时期针对当时的WEB标准有一些不一样的处理（虽然大部分一样），比如：IE6、IE8、IE10+等对于一些JS事件处理、CSS样式渲染有所不同。
而恰恰又有一些人在使用着不同类型的浏览器，以及不同浏览器的不同版本。所以，为了能让你的网站让这些不同的人看到效果一致，你就不得不做兼容，除非这些人不是你的目标用户。

## 移动端为什么要做适配

在移动端虽然整体来说大部分浏览器内核都是Webkit，而且大部分都支持CSS3的所有语法。但是，由于手机屏幕尺寸不一样，分辨率不一样，或者你需要考虑横竖屏的问题，这时候你也就不得不解决在不同手机上，不同情况下的展示效果了。

另外一点，UI一般输出的视觉稿只有一份，比如淘宝就会输出：`750px` 宽度的（高度是动态的一般不考虑）（[详情](https://github.com/amfe/article/issues/17)），这时候开发人员就不得不针对这一份设计稿，让其在不同屏幕宽度下显示 `一致`。

> `一致`是什么意思？就是下面提到的几个主要适配的问题。

## 主要适配几个问题

1. 容器/元素自适应问题
1. 文字大小问题
1. 图片清晰文件
1. 1px边框问题
1. 横竖屏显示问题

## 一、容器/元素自适应问题

这是最先要解决的问题，比如：视觉稿如果是 `1080px`，那么你做出来的页面，如何能在 `320px` 和 `375px` 以及 `360px` 等屏幕尺寸下正常等比例显示？

最佳实践，就是使用：`rem`。（关于rem的看[这里](https://isux.tencent.com/web-app-rem.html)）

### 举个栗子

在1080px的视觉稿中，左上角有个logo，宽度是180px。那么：

* 在CSS像素是320px的手机上，应该显示多大呢？答案是：320px * 180 / 1080 = 53.3333px
* 在CSS像素是360px的手机上，应该显示多大呢？答案是：360px * 180 / 1080 = 60px
* 在CSS像素是375px的手机上，应该显示多大呢？答案是：375px * 180 / 1080 = 62.5px

那么问题来了，我怎么让大小随着手机CSS像素数（**注意：这里跟手机屏幕大小没必然关系！**）不同而不同呢？

### 解决思路

**1、使用css的 `@media` 设置在不同屏幕尺寸下，显示不同的结果**

```css
@media only screen and (min-width: 375px) {
  .logo {
    width : 62.5px;
  }
}

@media only screen and (min-width: 360px) {
  .logo {
    width : 60px;
  }
}

@media only screen and (min-width: 320px) {
  .logo {
    width : 53.3333px;
  }
}
```

那么问题来了，我页面上那么多元素，是不是全部都得写到 `@media` 里面，不同的尺寸下，写三份呢？而且加入我又有一个尺寸是 `345px`，那么它默认按照 `min-width : 360px`生效，肯定会所有差异！

所以，以上做法既吃力，又不讨好，真是闹心。

**2、使用css的 `rem` 单位解决**

```css
@media only screen and (min-width: 375px) {
  html {
    font-size : 375px;
  }
}

@media only screen and (min-width: 360px) {
  html {
    font-size : 360px;
  }
}

@media only screen and (min-width: 320px) {
  html {
    font-size : 320px;
  }
}

.logo{
	width : 180rem / 1080;
}

```

这种做法有效的解决了体力劳动，也就是说，所有的页面元素只需要写一处就可以了，唯有html根字体需要使用 `@media` 查询来控制。

但是还有以下问题：

* 字体都是300多px，是不是太大啦；
* `@media` 只是个边界，处于 `min-width` 中间的屏幕，还是并未严格符合视觉稿；
* `180px / 1080` 写的到处都是，传统 `css` 还不支持，只有类似于 `less` 或者 `scss` 才支持；

**3、JS解决方案**

首先，通过js动态获取屏幕尺寸，动态设置html字体大小到可控范围。

```js
//比如：360px，这里是逻辑像素也就是css像素，不是设备像素。

var clientCssWidth = document.documentElement.clientWidth = 360;

//说明：
//如果，fontSize = clientCssWidth，就等于：360px，是不是太大啦？
//同时，这里除以1080以后，相当于把字体缩小了1080，这样css中就不用除以1080了不是吗？
//最后，乘以100，相当于放大了54倍的字体，不然字体就小于1px啦，你见过0.1px的字体吗？所以，在css里面只需要缩小100倍就可以了。

document.documentElement.style.fontSize = (100 * clientCssWidth / 1080) + 'px' = 100 * 360 / 1080 px 约= 33.3333px;

```

通过以上动态js，我们再来配置一下css。

首先，除以1080就可以省略啦，因为我们的根html的字体已经除以了1080啦。

```css
.logo{
	width : 180rem;
}
```

其次，由于字体又放大了10倍，所以，在这里还需要除以100。

```css
.logo{
	width : 180rem / 100;
}
```

最后，再还原设计稿的时候，任何一个元素只需要按照标注的尺寸除以10即可。如果使用 `scss` 的话，设置一个变量，即可。

```css
$cssRadio : 100；
.logo{
	width : 180rem / $cssRadio;
}
```

到这里，问题是解决了，但是最终还会有点问题，就是在 `1080px` 下元素小于 `100px` 时，再除以100，最后得到总是 `0.xxxxrem`，或者有个元素是 `5px` 时，最后计算出来是 `0.05rem` 可能会被浏览器忽略。。。

**4、终极解决方案（变通）**

我们可以动态调整100个因子，调整的2个约定条件是：

* html根字体大小位于：10px ~ 100px 之间
* css换算因子位于：10-100 之间

比如：我们把100变为60，那么最终的解决方案是：

```js
document.documentElement.style.fontSize = (60 * clientCssWidth / 1080) + 'px' = 60 * 360 / 1080 px = 20px;
```

```css
$cssRadio : 60；
.logo{
	width : 180rem / $cssRadio;
}
```
这样是不是就好多啦？

## 参考

* [使用Flexible实现手淘H5页面的终端适配](https://github.com/amfe/article/issues/17)
* [移动开发屏幕适配分析](http://www.cnblogs.com/strick/p/5197521.html)
* [移动端高清、多屏适配方案](http://www.html-js.com/article/Mobile-terminal-H5-mobile-terminal-HD-multi-screen-adaptation-scheme%203041)
* [web app变革之rem](https://isux.tencent.com/web-app-rem.html)