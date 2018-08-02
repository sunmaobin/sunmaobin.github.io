# 移动端H5解惑-页面适配（二）

## 一、基础概念

在了解如何做H5页面适配前，大家都应该把移动端涉及的一些概念搞明白，比如：`dpr` 是什么意思？

[移动端H5解惑-概念术语（一）](https://github.com/sunmaobin/sunmaobin.github.io/issues/27)



## 二、为什么要做页面适配



### 2.1 PC端为什么要解决浏览器兼容

因为在PC端，由于浏览器种类太多啦，比如几个常用的：IE、火狐、Chrome、Safari等。同时，由于历史原因，不同浏览器在不同时期针对当时的WEB标准有一些不一样的处理（虽然大部分一样），比如：IE6、IE8、IE10+等对于一些JS事件处理、CSS样式渲染有所不同。

而恰恰又有一些人在使用着不同类型的浏览器，以及不同浏览器的不同版本。所以，为了能让你的网站让这些不同的人看到效果一致，你就不得不做兼容，除非这些人不是你的目标用户。



### 2.2 移动端为什么要做适配

在移动端虽然整体来说大部分浏览器内核都是webkit，而且大部分都支持CSS3的所有语法。但是，由于手机屏幕尺寸不一样，分辨率不一样，或者你需要考虑横竖屏的问题，这时候你也就不得不解决在不同手机上，不同情况下的展示效果了。

另外一点，UI一般输出的视觉稿只有一份，比如淘宝就会输出：`750px` 宽度的（高度是动态的一般不考虑）（[详情](https://github.com/amfe/article/issues/17)），这时候开发人员就不得不针对这一份设计稿，让其在不同屏幕宽度下显示 `一致`。

`一致`是什么意思？就是下面提到的几个主要解决的问题。



## 三、页面适配主要解决的问题

1. 元素自适应问题
1. 文字rem问题
1. 高清图问题
1. 1像素问题
1. 横竖屏显示问题
1. 手机字体缩放问题



### 3.1 元素自适应问题



**举个栗子：**

在 `1080px` 的视觉稿中，左上角有个logo，宽度是 `180px`（高度问题同理可得）。

那么logo在不同的手机屏幕上等比例显示应该多大尺寸呢？



其实按照比例换算，我们大致可以得到如下的结果：

- 在CSS像素是 `375px` 的手机上，应该显示多大呢？结果是：`375px * 180 / 1080 = 62.5px`
- 在CSS像素是 `360px` 的手机上，应该显示多大呢？结果是：`360px * 180 / 1080 = 60px`
- 在CSS像素是 `320px` 的手机上，应该显示多大呢？结果是：`320px * 180 / 1080 = 53.3333px`



以下就是一些实现思路：

#### 方案1：使用css的媒体查询 `@media` 

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

**这个方案有2个比较突出的问题：**

1. 如果再多一种屏幕尺寸，就得多写一个 `@media` 查询块；
2. 页面上所有的元素都得在不同的 `@media` 中定义一遍不同的尺寸，这个代价有点高。



#### 方案2：使用 `rem` 单位

注意我们的推导公式：

- 在CSS像素是 `375px` 的手机上，应该显示多大呢？结果是：`375px * 180 / 1080 = 62.5px`
- 在CSS像素是 `360px` 的手机上，应该显示多大呢？结果是：`360px * 180 / 1080 = 60px`
- 在CSS像素是 `320px` 的手机上，应该显示多大呢？结果是：`320px * 180 / 1080 = 53.3333px`

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

方案2有效的解决了方案1中，同一个元素需要在多个 media 中写的问题，这里只需要多定义几个 media 就可以大致解决问题了。



但是本方案仍然有以下问题：

1. 针对不同的手机分辨率，需要写多套 `@media` 查询语句，多一种机型就需要多写一套查询语句，而且随着现在手机的层出不穷，这个页面很有可能在一些新出的机型上有问题。
2. 每个元素都需要除以1080这个设计稿的尺寸。



针对除以1080我们能不能直接放到html的font-size上，变成这样：

```css
@media only screen and (min-width: 375px) {
  html {
    font-size : 375px / 1080;
  }
}

@media only screen and (min-width: 360px) {
  html {
    font-size : 360px / 1080;
  }
}

@media only screen and (min-width: 320px) {
  html {
    font-size : 320px / 1080;
  }
}

.logo{
	width : 180rem;
}
```

如果变成这样，那么 `.logo` 的css中就只需要按设计稿的尺寸大小写就可以了。到底可不可以呢？

答案是：**不可以**。



主要原因是，浏览器有最小字体限制：

* PC上最小 `font-size=12`
* 手机上最小 `font-size=8`

如果小于最小字体，那么字体默认就是最小字体。



再来看上面的css，比如：

```css
@media only screen and (min-width: 375px) {
  html {
    font-size : 375px / 1080; //0.347222px
  }
}

.logo{
	width : 180rem; //期望结果：375px / 1080 * 180 = 62.5px
}
```

所以当你这么设置font-size时，在手机上由于小于最小字体8px，所以页面会按照默认字体算。

所以，最终就相当于你是这么设置的：

```css
@media only screen and (min-width: 375px) {
  html {
    font-size : 8px;
  }
}

.logo{
	width : 180rem; //实际结果：1440px
}
```



**所以，大家在设置html的font-size的时候一定要保证最小等于8px！**



因而为了解决这个问题，建议大家使用Sass这种Css开发语言，可以定义公式的，这样写css就方便了。

最终使用Sass的代码如下：

```scss
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

//定义方法：calc
@function calc($val){
    @return $val / 1080;
}

.logo{
	width : calc(180rem);
}
```



以上方案虽然解决了问题，但任然有以下缺陷：

1. 不同的尺寸需要写多个 `@media`
2. 依赖css的开发工具，比如：sass/less等
3. 所有涉及到使用rem的地方，全部都需要调用方法 `calc()` ，这个也挺麻烦的。



#### 方案3：js动态设置根字体

由于方案2最主要的问题就是需要针对不同的屏幕尺寸，定义多个 `@media`，所以我们先将这个字体设置改为动态设置。



注意我们的推导公式：

- 在CSS像素是 `375px` 的手机上，应该显示多大呢？结果是：`375px * 180 / 1080 = 62.5px`
- 在CSS像素是 `360px` 的手机上，应该显示多大呢？结果是：`360px * 180 / 1080 = 60px`
- 在CSS像素是 `320px` 的手机上，应该显示多大呢？结果是：`320px * 180 / 1080 = 53.3333px`



```js
//获取手机屏幕宽度
var deviceWidth = document.documentElement.clientWidth;

//将方案二中的media中的设置，在这里动态设置
//这里设置的就是html的font-size
document.documentElement.style.fontSize = deviceWidth + 'px';
```

**需要注意**：

> document.documentElement.clientWidth 这个语句能获取到的准确的手机尺寸的前提是建立在html中设置了如下标签：
>
> ```Html
> <meta name="viewport" content="width=device-width">
> ```
>
> 要不然获取到的结果将始终是：980（[查看原因](https://stackoverflow.com/questions/31767904/why-is-document-documentelement-clientwidth-980px-on-mobile-phone)）



然后Sass中就可以按照设计稿的尺寸大小去写就行了：

```css
//定义方法：calc
@function calc($val){
    @return $val / 1080;
}

.logo{
	width : calc(180rem);
}
```



如果不考虑别的因素，只是页面元素大体适配的话，该方案基本就满足要求了，但是现实中我们其实还有很多问题，所以我们的方案还需要继续优化。



### 3.2 文字rem问题

文字也采用rem的单位主要有什么问题呢？

1. 可能会出现通过rem计算，最终呈现到页面上是 `23.335px` 这样的奇葩的字体大小，可能还会因此出现锯齿、模糊不清等问题；
2. 对于大屏希望一行显示的文字多一些，小屏显示的少一些，而不是一视同仁的全部显示同样多的文字。这样在大屏下显得文字特别大（下文 `3.5 横竖屏显示问题` 会仔细讲）。



**对于以上问题，我个人的建议**：

1. 对于出现奇葩字体的问题，其实手机上表现并没那么明显，主要原因是现在屏幕显示效果统一编号，另外html对字体显示也做优化，所以，如果产品要求不严格，可以不用考虑处理；
2. 对于横竖屏问题，看情况吧，如果要求不严格，也可以不用考虑。



如果一定要解决这个问题，那么字体就不要使用rem方案了，而是继续使用px单位。

我们上面提到 `大屏` `小屏` 其实隐含的意思并不是手机屏幕大，而是手机的屏幕分辨率不一样，其实就是dpr不一样，所以我们针对不同的dpr设置具体的字体就可以了。



比如，我们针对页面的标题的字体大小就可以如下设置：

```css
.title {
    font-size: 12px;
}
[data-dpr="2"] .title {
    font-size: 24px;
}
[data-dpr="3"] .title {
    font-size: 36px;
}
```



### 3.3 高清图问题

先来看看 [这里](http://www.html-js.com/article/Mobile-terminal-H5-mobile-terminal-HD-multi-screen-adaptation-scheme%203041) 这篇文章，有讲解了为什么在有些屏幕上要使用 `@2x` `@3x` 的高清图。

再来看看 [这里](http://www.ghugo.com/mobile-h5-fluid-layout-for-iphone6/) 讲解了具体的高清图的解决方案。

我这里简单归纳下。



#### 3.3.1 对于 `<img>` 标签引入的图片高清解决方案

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



#### 3.3.2 对于背景图片高清解决方案

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



### 3.4 1像素问题

什么是 1像素问题 ？ 

> 我们说的1像素，就是指1 CSS像素。
>
> 比如设计师实际了一条线，但是在有些手机上看着明显很粗，为什么？
>
> 因为这个1px，在有些设备上（比如：dpr=3），就是用了横竖都是3的物理像素矩阵（即：3x3=9 CSS像素）来显示这1px，导致在这些设备上，这条线看上去非常粗！
>
> 其实在在中手机上应该是1/3px显示这条线。



关于 `dpr`，不理解的，可以看看之前的 [这篇](http://www.night123.com/2016/night-webapp-disabuse-page-concept/) 文章。

问题描述清楚了，我们该怎么处理呢？



#### 方案1：使用css3的 `scaleY(0.5)` 来解决

比如：div的border-top的1px问题解决。

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



#### 方案2：页面缩放解决问题

我们先来讲讲页面缩放能解决1px问题的原理示。

首先大家需要了解一些 `viewport` 的常识，参考：[这里](https://www.cnblogs.com/2050/p/3877280.html)



假如以下手机的 `dpr=2`



<img src="https://i.imgur.com/HeYPZWY.png" width="600px">



对于dpr=2的手机设备，1px就会有 `2x2` 的物理像素来渲染，但是当缩放以后其实就变成 `1x1` 个单位渲染了，看下面示意图：



<img src="https://i.imgur.com/hGfoNXQ.png" width="400px">



所以，我们的思路就是将真个页面缩小dpr倍，再将页面的根字体放大dpr倍。这样页面虽然变小了，但是由于页面整体采用rem单位，当根字体放大dpr倍以后，整体都放大了，看上去整体样式没什么变化。



**1、将scale设置为1/dpr**

假如：dpr = 2

```html
<meta name="viewport" content="width=device-width,initial-scale=0.5">
```



**2、clientWidth获取的值会自动扩大dpr倍**

比如，以前是360px，当页面缩小0.5倍，获取到的值会变为720px。

不知道这个原理的，这篇文章讲的还是比较清楚：[这里](https://www.cnblogs.com/2050/p/3877280.html)

```js
var deviceWidth = document.documentElement.clientWidth;
document.documentElement.style.fontSize = deviceWidth + 'px';
```



**3、css中涉及到1像素问题的地方使用 `px` 作为单位**

比如：

```css
.box{
	border : 1px solid #ddd;
}
```



**以上步骤最终整理的结果：**

html:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width">
</head>
<body>
    <div class="box">
        <div class="logo">Logo</div>
    </div>
</body>
</html>
```

js:

```js
//获取屏幕宽度、dpr值
var deviceWidth = document.documentElement.clientWidth,
    dpr = window.devicePixelRatio || 1;

//设置根字体扩大dpr倍
//由于deviceWidth当页面缩小dpr倍时，本身获取的值就增加dpr倍
//所以这里不需要再乘以dpr了
document.documentElement.style.fontSize = deviceWidth + 'px';

//设置页面缩放dpr倍
document.getElementsByName('viewport')[0]
    .setAttribute('content','width=device-width;initial-scale=' + 1/dpr)
```

scss：

```css
@function calc($val){
    @return $val / 1080;
}

.logo{
	width : calc(180rem);
}

.box{
	border : 1px solid #ddd;
}
```



### 3.5 横竖屏显示问题

横竖屏问题，就是当你横屏手机、竖屏手机时看到的不一样的效果问题。

我这里要说的这个问题，就是设计师会针对横屏或者竖屏，做不一样的设计，比如：横屏时显示摘要，竖屏时只有标题，这种情况下，我们应该怎么适配的问题。



关于横竖屏问题，我将会分2个部分来说明：

1. 横竖屏显示内容不同；
1. 横竖屏显示样式不同；



#### 3.5.1 横竖屏显示内容问题

我们知道横屏，相当于屏幕变宽了，这时候一行显示的内容就可以更多。所以，设计师可能会对横竖屏做2种不同的内容设计，如：

![](http://i.imgur.com/oL7Gecf.png)

如果设计师本身就设计了2套样式，那么我们只需要准备2套css，依据横竖屏直接显示对应的样式，然后html中做好兼容即可。

下文会将如何判断横竖屏。



#### 3.5.2 横竖屏显示样式问题

这里有个要说的就是，设计师没有设计横屏的样式，那么如果我们按照上文提到的方案去处理，那么就会发现在横屏模式下字体显得非常大（因为屏幕宽了），显示的内容就少了。

这种情况会显得很不协调，虽然还是等比例显示的，只不过需要多拖动下滚动条而已，但是你会觉得很怪。尤其是再有弹出框的时候，会更麻烦，弹出框有时候可能还会显示不完全。。。

比如，下面的样式：

![](http://i.imgur.com/7CEyHG8.png)

像这种问题，我们上面提到的依据屏幕宽度自动调整根目录font-size的大小，就有点不合适了。这样虽然保证了横向的比例是严格按照设计搞来的，但是显示上非常丑。

所以，我们一般的做法就是在横屏的时候将 `deviceWidth=deviceHeight`。



* 正常竖屏大小：

<img src="https://i.imgur.com/2lTxsVE.png" width="600px">



* 横屏时让width=height

<img src="https://i.imgur.com/WGyveOl.png" width="700px">



* 不做横竖屏特殊宽度处理时

<img src="https://i.imgur.com/hQNSEbz.png" width="700px">



以上3组画面对比我们得到的效果是：

1. 在横屏下如果让width=height，那么整体页面的宽度等于竖屏时看到的宽度，整体布局不会有变化，只是纵向看到的内容多少发生了变化；
2. 如果横屏不做处理，横屏是width其实就等于竖屏时的height，即700px，这时候整体页面显示非常宽，文字比较大。



所以，经过我们的实际对比体验以后，一致认为横屏时让 `width=height` 体验比较好。

附上核心代码：

```js
var deviceWidth = document.documentElement.clientWidth,
    deviceHeight = document.documentElement.clientHeight

//横屏状态
if (window.orientation === 90 || window.orientation === -90) {
    deviceWidth = deviceHeight;
};

//设置根字体大小
document.documentElement.style.fontSize = deviceWidth + 'px';
```



#### 3.5.3 附1：JS检测横竖屏

js获取屏幕旋转方向：`window.orientation`

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


#### 3.5.4 附2：CSS判断横竖屏

* 写在同一个CSS中：

```css
@media screen and (orientation: portrait) {
  /*竖屏 css*/
} 
@media screen and (orientation: landscape) {
  /*横屏 css*/
}
```



* 分开写在2个CSS中，在link中通过media筛选加载：

```html

<!-- 竖屏 -->
<link rel="stylesheet" media="all and (orientation:portrait)" href="portrait.css">

<!-- 竖屏 -->
<link rel="stylesheet" media="all and (orientation:landscape)" href="landscape.css">

```



### 3.6 手机字体缩放问题

手机字体缩放是什么问题呢？

就是当你在手机 `设置 -> 字体设置` 中将字体放大或者缩小，使得手机整体系统字体发生了变化，这时候可能就会影响到H5页面正常的显示。

经过实际测试，这个问题当前发生的概率不是很大，因为很多手机厂商都已经做了保护措施。但是为了保险起见，我们还是有必要进行检测，一旦不一样就要采取措施。



#### 3.6.1 如何检测手机字体不是默认字体

```js
var deviceWidth = document.documentElement.clientWidth;

//设置根字体大小
var setFz = deviceWidth + 'px';
document.documentElement.style.fontSize = setFz;

//获取实际html字体大小
var realFz = window.getComputedStyle(document.documentElement)
	.getPropertyValue('font-size') //如：360px

//比较二者是否相同
if(setFz !== realFz){
    //TODO 设置的字体和实际显示的字体不同
};
```



#### 3.6.2 如果手机字体不是默认字体如何处理

比如：你想设置的字体大小为100px，但是实际大小却为50px，那么你可以确定其实用户字体是缩放了0.5，这时候你就需要将你的字体扩大1倍，这样才能保证实际页面的字体是100。

所以，按照这个等比例换算以后，我们就需要重新设置页页面的font-size。

```js
var deviceWidth = document.documentElement.clientWidth;

//设置根字体大小
var setFz = deviceWidth + 'px';
document.documentElement.style.fontSize = setFz;

//获取实际html字体大小
var realFz = window.getComputedStyle(document.documentElement)
	.getPropertyValue('font-size') //如：360px

//比较二者是否相同
if(setFz !== realFz){
    //去掉单位px，下面要参与计算
    setFz = parseFloat(setFz);
    realFz = parseFloat(realFz);
    
    //重新计算要设置的新的字体大小
    //公式推导：100 -> 50，x -> 100，求x?
    //即：setFz -> realFz, x -> setFz，求x?
    var x =  setFz * setFz / realFz;
    
    //重新设置html的font-size
    document.documentElement.style.fontSize = x + 'px';
};
```



这么做理论上已经解决了问题，但是还有点瑕疵，问题就是：

* 如果字体不是默认字体，首先会设置一次font-size，重新计算后再次设置一次font-size，反应到页面上就是页面可能会快速晃动一次，因为两次设置的字体大小不一样，如果手机配置不高，估计晃动会很明显。



如何解决这个问题？思路就是：

1. 给页面增加一个隐藏元素，设置其字体大小为100px
2. 获取这个元素在页面上的实际字体大小是否为100px
3. 如果设置的和实际的不等，则计算其比例。



最终代码片段如下：

```js
var deviceWidth = document.documentElement.clientWidth;

var setFz = '100px';

//给head增加一个隐藏元素
var h = document.getElementsByTagName('head')[0],
    s = document.createElement('span');
    s.style.fontSize = setFz;
    s.style.display = 'none';
    h.appendChild(s);

//判断元素真实的字体大小是否100px
//如果不相等则获取真实的字体换算比例
var realFz = getComputedStyle(s).getPropertyValue('font-size');

if(setFz !== 'realFz'){
    //去掉单位px，下面要参与计算
    setFz = parseFloat(setFz);
    realFz = parseFloat(realFz);
    
    //由于：var x = setFz * setFz / realFz;
    //公式推导：x -> setFz, y -> deviceWidth
    //所以：var y = deviceWidth * x / setFz;
    
    //重置deviceWidth
    deviceWidth = deviceWidth * setFz / realFz;
};

document.documentElement.style.fontSize = deviceWidth + 'px';
```



## 四、最终适配方案（v1.0）

除了上面一步步的分析中间的原理之外，我们可能还需要考虑或者遇到以下问题：

1. 到底什么时候动态初始化上面的js脚本？
2. 偶尔还可能会遇到进入页面时 `document.documentElement.clientWidth=0` 的bug？
3. 页面晃动？页面空白？页面整体凌乱然后又正常等问题？



所以，在尽可能的解决诸多问题后，最终的脚本如下：

html:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width">
</head>
<body>
    <!-- 正文 -->
</body>
</html>
```

js:

```js
/**
 * @DESCRIPTION 移动端页面适配解决方案 v1.0
 * @AUTHOR      Night
 * @DATE        2018年08月01日
 */
(function(window, document){
    var docEle = document.documentElement,
        dpr    = window.devicePixelRatio || 1,
        scale  = 1 / dpr;
    
    var fontSizeRadio = 1, //手机字体正常比例
        isLandscape   = false;//是否横屏
    
    ///////////////////////// viewport start //////////////////////////////////
    
    //设置页面缩放比例并禁止用户手动缩放
    document.getElementsByName('viewport')[0].setAttribute('content','width=device-width,initial-scale='+scale+',maximum-scale='+scale+',minimum-scale='+scale+',user-scalable=no');
    
	///////////////////////// viewport end //////////////////////////////////
    
    //横屏状态检测
    if (window.orientation === 90 || window.orientation === -90) {
        isLandscape = true;
    };

    ///////////////////// system font-size check start //////////////////////
    
    //试探字体大小，用于检测系统字体是否正常
    var setFz = '100px';

    //给head增加一个隐藏元素
    var headEle = document.getElementsByTagName('head')[0],
        spanEle = document.createElement('span');
        spanEle.style.fontSize = setFz;
        spanEle.style.display = 'none';
        headEle.appendChild(spanEle);

    //判断元素真实的字体大小是否setFz
    //如果不相等则获取真实的字体换算比例
    var realFz = getComputedStyle(headEle).getPropertyValue('font-size');

    if(setFz !== 'realFz'){
        //去掉单位px，下面要参与计算
        setFz = parseFloat(setFz);
        realFz = parseFloat(realFz);

        //获取字体换算比例
        fontSizeRadio = setFz / realFz;
    };
    
    ///////////////////// system font-size check end //////////////////////
    
    var setBaseFontSize = function(){
        var deviceWidth = docEle.clientWidth,
            deviceHeight= docEle.clientHeight;
        
        if(isLandscape){
            deviceWidth = deviceHeight;
        };
        
        docEle.style.fontSize = deviceWidth * fontSizeRadio + 'px';
    };
    setBaseFontSize();
    
    //页面发生变化时重置font-size
    //防止多个事件重复执行，增加延迟300ms操作(防抖)
    var tid;
    window.addEventListener('resize', function() {
        clearTimeout(tid);
        tid = setTimeout(setBaseFontSize, 300);
    }, false);
    window.addEventListener('pageshow', function(e) {
        if (e.persisted) {
            clearTimeout(tid);
            tid = setTimeout(setBaseFontSize, 300);
        };
    }, false);
    
})(window, document);
```

scss：

```scss
//设计稿尺寸大小，假如设计稿宽度750
$baseDesignWidth = 750;

@function calc($val){
    @return $val / $baseDesignWidth;
}

//适配元素采用rem，假如设计稿中元素宽度180
.logo{
	width : calc(180rem);
}

//边框采用px，假如设计稿边框宽度1px
.box{
	border : 1px solid #ddd;
}
```



## 五、新页面适配技术可以考虑（v2.0）

如果不太考虑老的手机型号，可以采用 `viewport` 单位。

由于我本人也没有在项目中使用这个方案，所以不过多发表言论，大家有兴趣的可以研究下。



具体方案细节参考：

* [大漠 - 再聊移动端页面的适配](https://www.w3cplus.com/css/vw-for-layout.html)
* [大漠 - 如何在Vue项目中使用vw实现移动端适配](https://www.w3cplus.com/mobile/vw-layout-in-vue.html)



## 六、后记

讲了这么多，这里总结下，任何事情弄懂原理最重要！

比如，当你首次看 [使用Flexible实现手淘H5页面的终端适配](https://github.com/amfe/article/issues/17) 这篇文章的时候你会很感慨，感觉很有收获，但是当你实际开始项目的时候，却不知道该怎么下手。

俗话说，台上一分钟，台下十年功。

为了写本文以及姊妹篇，我个人零零散散的时间加起来不下1个月，一直到（`2016年12月2日`）才发表了本文的第一版。由于收到一些流言反馈和后续知识的积累，于是决定今天（`2018年08月01日`）再把它重新整理一遍，以让大家更清楚这中间的原理。

因为中间涉及的东西太多，只要有一个知识有些不清楚，可能就会卡克！比如这个概念 `dips`，不同的文章有不同的说法，而且还给你解释了它跟 `dip` 的不同，其实就是指 `CSS像素`，这些人故意发明一些专业词汇，搞的你晕头转向，所以，当你看了我的这两篇文章，也许还是一知半解，这很正常，慢慢来，多多练习，相信你会明白的。

如果还有哪里不清楚，或者本文有错误的地方，感谢批评指正。



> 本文重新编辑于：2018年08月01日
>
> 1. 针对大家的留言以及个人的反复推敲，重新整理了这遍文章；
> 2. 增加针对手机本身字体放大、缩小的解决方案，以及一些新的替代方案思路。



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
* [Retina屏的移动设备如何实现真正1px的线？](http://www.tuicool.com/articles/6Vvqmu)
* [解决因为手机设置字体大小导致h5页面在webview中变形的BUG](https://blog.csdn.net/fungleo/article/details/73309396)

（全文完）