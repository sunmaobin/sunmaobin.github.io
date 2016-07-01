---

title: CSS解惑-rem和em
date: 20160701103223
categories: [WEB]
tags: [css]

---

css3中新增单位 `rem`，那么如何区分和何时使用 `rem` 和 `em` 呢？

## 一、定义

### 1、rem

指相当于document根目录字体而言的相对单位，默认是相当于浏览器默认字体（16px）,即：1rem = 16px。

### 2、em

相当于使用它的容器的字体而言，如果使用者的字体定义单位也是 `em` ，那么就有继承关系。

如：

```
|-- div1（font-size:12px）
    |-- div2（font-size:2em;padding:3em）
```

div2的padding = 3 x 2 x 12px = 72px。

既然都是相对单位，那么再不考虑浏览器兼容的情况下，如何选择使用这2个单位呢？

## 二、使用

一般有2种情况可以考虑使用 `em` ，其余全部使用 `rem`。

哪两种呢？

1. menu中，下一级菜单依赖于上一级菜单的字体大小。比如：二级菜单字体比一级菜单小。
1. 按钮里面的图标，图标的大小跟文字的大小密切相关。

当然以上两种只是比较典型的代表，只要是有严重依赖相关元素尺寸的，使用 `em` 比较合理而已。

## 参考

如果大家看了以上文章，依然迷迷糊糊，说明你对这2个概念的基础只是掌握还不够，那么仔细阅读以下文章。

* [综合指南: 何时使用 Em 与 Rem](http://webdesign.tutsplus.com/zh-hans/tutorials/comprehensive-guide-when-to-use-em-vs-rem--cms-23984)
* [浅谈viewport、响应式、自适应布局](http://www.chengfeilong.com/mobile-layout)
* [移动开发屏幕适配分析](http://www.cnblogs.com/strick/p/5197521.html)