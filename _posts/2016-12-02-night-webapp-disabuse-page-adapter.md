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

1. 元素自适应问题
1. 文字大小和边框问题
1. 高清图问题
1. 1像素问题
1. 横竖屏显示问题

## 一、元素自适应问题

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

**4、终极解决方案**

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

## 二、文字大小和边框问题

### 2.1 通用的解决方案

对于文字的大小，大多数解决的解决方案是：**文字不要使用rem自动调整大小！**，原因是（看[这里](https://github.com/amfe/article/issues/17)，搜索：文本字号不建议使用rem）：

* 在大屏设备希望看到更多的文字；
* 中文点阵最好是在12px，14px，16px这种尺寸，使用rem就会无法避免使用13px，15px尺寸，这样文字会显示的很奇怪；

那么如果文字不使用rem，那么怎么设置呢？

```css
div {
    font-size: 12px; // 默认写上dpr为1的fontSize
}
[data-dpr="2"] div {
    font-size: 24px;
}
[data-dpr="3"] div {
    font-size: 36px;
}
```

对于边框，也使用rem，仅仅使用px，原因是：边框一般我们是不需要改变粗细的，比如设计师设计了1px的边框，并不是说在 `dpr=3` 的机器上，就希望显示3px。而是希望在任何分辨率的屏幕上，都显示1px，所以这个问题我们通过页面缩放来解决。下文在讲 `1px的问题` 的时候，会详细解释。

### 2.2 严格还原设计稿的需求

假如设计师要求还原程度要跟设计稿完全一致！那么，对于文字而言，其实我们也可以使用rem，一劳永逸！

在文字使用了rem以后，针对上方提到的不使用rem的2个问题，也就有了新的答案

* 文字在所有的屏幕上，显示个数都一样，只是大小不一样；
* 可能会出现13px，15px等字号，但是感觉不明显，我觉得可以接受。

所以，其实我们现在的做法是文字没做特殊处理，页面上的所有元素都使用rem！！！

## 三、高清图问题

先来看看 [这里](http://www.html-js.com/article/Mobile-terminal-H5-mobile-terminal-HD-multi-screen-adaptation-scheme%203041) 这篇文章，有讲解了为什么在有些屏幕上要使用 `@2x` `@3x` 的高清图。

再来看看 [这里](http://www.ghugo.com/mobile-h5-fluid-layout-for-iphone6/) 讲解了具体的高清图的解决方案。

我这里简单归纳下。

### 3.1 对于<img>标签引入的图片高清解决方案

1、使用 `srcset` 标签

```html
<img src="http://g.ald.alicdn.com/bao/uploaded/i1/TB1d6QqGpXXXXbKXXXXXXXXXXXX_!!0-item_pic.jpg_160x160q90.jpg" srcset="http://img01.taobaocdn.com/imgextra/i1/803091114/TB2XhAPaVXXXXXmXXXXXXXXXXXX_!!803091114.jpg 2x, http://gtms04.alicdn.com/tps/i4/TB1wDjWGXXXXXbtXVXX6Cwu2XXX-398-510.jpg_q75.jpg 3x">
```

> 关于 `srcset` 的说明：[猛戳这里](http://developer.51cto.com/art/201309/410720.htm)

2、使用js自带的 `Image` 异步加载图片

```html
<img id="img" data-src1x="xxx@1x.jpg" data-src2x="xxx@2x.jpg" data-src3x="xxx@3x.jpg"/>
```

```js
var dpr = window.devicePixelRatio;
if(dpr > 3){
	dpr = 3;
};

var imgSrc = $('#img').data('src'+dpr+'x');
var img = new Image();
img.src = imgSrc;
img.onload = function(imgObj){
	$('#img').remove().prepend(imgObj);//替换img对象
};

```

### 3.2 对于背景图片高清解决方案

1、使用 `media query` 来处理

```css
/* 普通显示屏(设备像素比例小于等于1)使用1倍的图 */
.css{
    background-image: url(img_1x.png);
}

/* 高清显示屏(设备像素比例大于等于2)使用2倍图  */
@media only screen and (-webkit-min-device-pixel-ratio:2){
    .css{
        background-image: url(img_2x.png);
    }
}

/* 高清显示屏(设备像素比例大于等于3)使用3倍图  */
@media only screen and (-webkit-min-device-pixel-ratio:3){
    .css{
        background-image: url(img_3x.png);
    }
}
```

2、使用 `image-set` 来处理（有兼容问题）

```css
.css {
    background-image: url(1x.png); /*不支持image-set的情况下显示*/
    background: -webkit-image-set(
            url(1x.png) 1x,/* 支持image-set的浏览器的[普通屏幕]下 */
            url(2x.png) 2x,/* 支持image-set的浏览器的[2倍Retina屏幕] */
            url(3x.png) 3x/* 支持image-set的浏览器的[3倍Retina屏幕] */
    );
}

```

## 四、1像素问题

什么是 `1像素问题` ？ 我们说的1像素，就是指1CSS像素。问题就是设计师实际了一条线，本来是1像素，但是在有些设备上，用了横竖都是3的物理像素（即：3x3=9像素）来显示这1像素（即：dpr=3），导致在这些设备上，这条线看上去非常粗！

关于 `dpr`，不理解的，可以看看之前的 [这篇](http://www.night123.com/2016/night-webapp-disabuse-page-concept/) 文章。

好了，问题描述清楚了，我们该怎么处理呢？

还记得上文中，在讲 `文字大小和边框问题` 的时候，我们说过，思路就是使用 `页面缩放` 来实现，现在看看具体方案。

### 4.1 使用css3的 `scaleY(0.5)` 来解决

比如div的border-top的1px问题实现：

```css
.div:before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: auto;
  right: auto;
  height: 1px;
  width: 100%;
  background-color: #c8c7cc;
  display: block;
  z-index: 15;
  -webkit-transform-origin: 50% 0%;
          transform-origin: 50% 0%;
}
@media only screen and (-webkit-min-device-pixel-ratio: 2) {
  .div:before {
    -webkit-transform: scaleY(0.5);
            transform: scaleY(0.5);
  }
}
@media only screen and (-webkit-min-device-pixel-ratio: 3) {
  .div:before {
    -webkit-transform: scaleY(0.33);
            transform: scaleY(0.33);
  }
}
```

但是，这种方案只能解决直线的问题，涉及到圆角之类的，就无能为力！

### 4.2 完美方案

***1、将scale设置为1/dpr***

假如：dpr = 2

```html
<meta name="viewport" content="width=device-width,initial-scale=0.5,maximum-scale=0.5, minimum-scale=0.5,user-scalable=no">
```

***2、将html的font-size扩大dpr倍***

假如：dpr = 2

```
document.documentElement.style.fontSize = (60 * clientCssWidth / 1080) * 2 + 'px' = 60 * 360 * 2 / 1080 px = 40px;
```

在写页面css的时候，涉及到1像素问题的地方，统统使用 `px` 作为单位。

比如：

```css
.div{
	border : 1px solid #ddd;
}
```

这种解决方案的原理就是：将页面整体所缩小1/2，又将html根字体扩大了2倍。所以，对于页面上使用rem的元素，等于没有变化，但是使用px的元素，由于页面缩小了1/2，所有元素尺寸就相当于缩小了1/2。对于上面的例子来说，1px就相当于0.5px了。

## 五、横竖屏显示问题

横竖屏问题，就是当你横屏手机、竖屏手机时看到的不一样的效果问题。

当然，如果大家使用本文前面讲的办法时，理论上在横屏时，只是页面显得会宽一些，滚动条会深一些而已，效果不会受影响。

我这里要说的这个问题，就是设计师会针对横屏或者竖屏，做不一样的设计，比如：横屏时显示摘要，竖屏时只有标题，这种情况下，我们应该怎么适配的问题。

先来说说场景，一般分为以下几种（其实，跟PC上所说的响应式差不多）：

1. 横竖屏显示内容不同（有无问题）；
1. 横竖屏显示样式不同（样式问题）；

再来说说通用的解决方案：

1. JS检测横竖屏并处理；
1. CSS检测横竖屏并处理；

### 5.1 JS检测横竖屏

`window.orientation`

* 0 - 正常方向
* -90 - 屏幕顺时钟旋转90度
* 90 - 屏幕逆时针旋转90度
* 180 - 屏幕旋转180度

```js
window.addEventListener("onorientationchange" in window ? "orientationchange" : "resize", function() {
    if (window.orientation === 180 || window.orientation === 0) { 
        console.log('竖屏状态！');
    };
    if (window.orientation === 90 || window.orientation === -90 ){ 
        console.log('横屏状态！');
    }  
}, false); 
```
### 5.2 CSS判断横竖屏

写在同一个CSS中：

```css
@media screen and (orientation: portrait) {
  /*竖屏 css*/
} 
@media screen and (orientation: landscape) {
  /*横屏 css*/
}
```

分开写在2个CSS中：

在link中通过media筛选加载：

```html

<!-- 竖屏 -->
<link rel="stylesheet" media="all and (orientation:portrait)" href="portrait.css">

<!-- 竖屏 -->
<link rel="stylesheet" media="all and (orientation:landscape)" href="landscape.css">

```

## 总结

讲了这么多，这里总结下，任何事情弄懂原理最重要！比如，当你首次看 [使用Flexible实现手淘H5页面的终端适配](https://github.com/amfe/article/issues/17) 这篇文章的时候，你会很感慨，感觉很有收获，但是当你实际开始项目的时候，却不知道该怎么下手。

俗话说，台上一分钟，台下十年功。为了写本文以及姊妹篇，我个人零零散散的时间加起来，不下1个月，因为中间涉及的东西太多，只要有一个知识有些不清楚，可能就会卡克！比如这个概念 `dips`，不同的文章有不同的说法，而且还给你解释了它跟 `dip` 的不同，其实就是指 `CSS像素`。这些人故意发明一些专业词汇，搞的你晕头转向。

所以，当你看了我的这两篇文章，也许还是一知半解，这很正常，慢慢来，多多练习，相信你会明白的。

## 参考

* [使用Flexible实现手淘H5页面的终端适配](https://github.com/amfe/article/issues/17)
* [移动开发屏幕适配分析](http://www.cnblogs.com/strick/p/5197521.html)
* [移动端高清、多屏适配方案](http://www.html-js.com/article/Mobile-terminal-H5-mobile-terminal-HD-multi-screen-adaptation-scheme%203041)
* [web app变革之rem](https://isux.tencent.com/web-app-rem.html)
* [移动端H5页面的设计稿尺寸（上）](http://zikoman.lofter.com/post/3bf3bb_6da8d80)
* [移动端H5页面的设计稿尺寸（下）](http://zikoman.lofter.com/post/3bf3bb_6da8e55)
* [H5自适应改造方案——rem方案](https://github.com/imweb/mobile/issues/3)
* [移动端H5页面之iphone6的适配](http://www.ghugo.com/mobile-h5-fluid-layout-for-iphone6/)
* [WebKit最新特性srcset简介](http://developer.51cto.com/art/201309/410720.htm)
* [HTML5实战与剖析之判断移动端横屏竖屏功能](http://www.w3cways.com/1772.html)

（全文完）