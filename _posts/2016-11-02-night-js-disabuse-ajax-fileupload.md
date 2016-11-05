---

title: JS解惑-ajax文件上传
date: 20161102104059
categories: [WEB]
tags: [js]

---

最近再用ajax进行上传的时候，用到了许多ajax上传的js插件，有一些坑，拿出来跟大家分享下。

## 常用的2款ajax上传插件

* [AjaxFileUpload](https://github.com/carlcarl/AjaxFileUpload)
* [jQuery File Upload](http://blueimp.github.io/jQuery-File-Upload/)

论功能来说，我是觉得 `jQuery File Upload` 要比 `AjaxFileUpload` 强大很多，比如：前者支持跨域。

当然，二者在处理ajax上传上面的思想都是一样的，就是通过 `iframe` 的方式提交上传以及获取返回结果等。

## 基础知识

###关于input:file的特殊限制

1. 处于安全限制，浏览器禁止使用js修改input:file的值。比如你想清空file文本框：`$('#file').val('')`，是不行滴。
1. 处于安全限制，对于input:file，`clone()`后的对象，value是空的。

### jquery中的clone()方法

注意：jquery中的clone，只针对的是 `html` 原型而言的！如果你将一个js对象clone()，就会报错了。

```js
jquery.min.js:2 Uncaught TypeError: Cannot read property 'ownerDocument' of undefined(…)
```

1. clone()，只克隆当前html元素，以及元素标签上绑定的事件，但不包括元素上通过js**动态**增加的事件，也不包括所有子节点；
1. clone(true)，克隆当前html元素，以及元素标签上绑定的事件和通过js动态增加的事件，但不包括所有子节点；
1. clone(true,true)，克隆当前html，以及所有事件，以及所有子节点和所有子节点的事件；

看个栗子：

```html
<input id="test" oninput=""
```

（全文完）

## 参考

