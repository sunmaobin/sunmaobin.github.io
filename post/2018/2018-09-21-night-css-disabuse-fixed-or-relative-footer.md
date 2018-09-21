# CSS解惑-如何让Footer始终固定在页面底部

## 需求

有这样一个需求：

* 当页面内容高度小于屏幕高度时，Footer固定在屏幕底部；
* 当页面内容高度大于屏幕高度时，Footer固定在页面底部，即：跟随在内容尾部，滚动条到最底部时看到。

## 踩过的坑

### 第1种方案：绝对定位 + padding

```css
body{
    position : relative;
    padding-bottom: 60px;
}

footer{
    position : absolute;
    bottom : 0;
    width : 100%;
    height : 60px;
}
```

这种方案可以保证footer一直在屏幕底部，当滚动条滚到最底部时，页面内容也不会被footer挡住。

但是问题就是：当在滚动页面的过程中，底部的Footer始终会挡住一部分页面的视线。

### 第2种方案：js控制footer的定位

```js
var resizeFooter = function(){
    if(document.body.clientHeight > window.innerHeight){
        document.querySelector('footer').style.position = 'relative';
        return;
    };
    document.querySelector('footer').style.position = 'absolute'
};

//页面加载完成后先计算一下高度，是否出现滚动条。
window.addEventListener('load',function(e){
	resizeFooter();
});

//页面变化之后，重新调整footer
window.addEventListener('resize',function(e){
	resizeFooter();
});
```

这种方案看是没有问题，但是实际上却有一个非常大的坑。

假如系统是SPA单页面应用，那么页面局部内容发生改变以后，就会影响到footer的显示。也就是说，你得考虑所有动态改变页面内容后，都得调用一次 `resizeFooter` ！

更加严峻的问题是，假如你使用的是MVVM框架，比如：vue，那么你调用 `resizeFooter` 一定需要在页面数据双向绑定完成之后，也就是页面充分渲染完之后才能调用，也就是 `mounted` 回调钩子中触发。

如果其他框架没有提供这类回调钩子，你可能就要崩溃了，自己写个 `setTimout` 延后一段时间执行？更不可靠。

而且这种方式，即便你JS控制的再好，也会在页面上看起来，Footer有个不自然的变化！

## 完美的解决方案

```css
html {
    position: relative;
    min-height: 100%;
}

body {
    margin-bottom: 60px;
}

footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 60px;
}
```

只需要以上代码即可，另外需要注意IE10下有个bug，需要HACK一下。

```js
/*!
 * IE10 viewport hack for Surface/desktop Windows 8 bug
 * Copyright 2014-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

// See the Getting Started docs for more information:
// http://getbootstrap.com/getting-started/#support-ie10-width

(function () {
  'use strict';

  if (navigator.userAgent.match(/IEMobile\/10\.0/)) {
    var msViewportStyle = document.createElement('style')
    msViewportStyle.appendChild(
      document.createTextNode(
        '@-ms-viewport{width:auto!important}'
      )
    )
    document.querySelector('head').appendChild(msViewportStyle)
  }

})();
```

以上内容参考于Bootstrap示例：[Sticky footer](https://getbootstrap.com/docs/3.3/examples/sticky-footer/)

## 延伸

CSS布局中有一种 “粘性布局”，即：`position:sticky`，跟我们刚才的footer控制的需求正好相反。

* 我们的需求：当内容高度小于屏幕高度时，footer固定在底部，否则相对内容高度显示；
* 粘性布局的特性：当内容到达粘性阈值前相对内容显示，达到后固定不变。

所以，粘性布局我们无法使用，但是作为学习，恰好跟我们的这个案例相反，还是值得一看的。

想了解这一特性，可以参考学习 `position:sticky` 语法以及如何爬坑：

* https://developer.mozilla.org/zh-CN/docs/Web/CSS/position#Sticky_positioning
* [position: sticky 详解（防坑指南）](https://segmentfault.com/a/1190000007183209)
* [BFC 神奇背后的原理](https://www.cnblogs.com/heimanba/p/3774086.html)

## 参考

* [How to position a footer/element relative to the bottom of the page? ](https://stackoverflow.com/questions/10470241/how-to-position-a-footer-element-relative-to-the-bottom-of-the-page)
* [Sticky footer](https://getbootstrap.com/docs/3.3/examples/sticky-footer/)