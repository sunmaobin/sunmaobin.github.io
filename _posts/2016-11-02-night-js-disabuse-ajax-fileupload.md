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

参考：[JS解惑-jQuery.clone](http://www.night123.com/2016/night-js-disabuse-jquery-clone/)

## 遇到的问题

### 1、第一次上传正常，以后就无法上传

原因是：你将 `file` 的 `onchange` 事件绑定到了 `file` 本身了。而第一次上传完毕后，当前 `file` 就被销毁，你实际看到的是 `clone()` 以后的元素。而 `clone()` 又没有克隆绑定事件，所以就没效果了。

### 2、第一次上传正常，以后选择同一张图片就无法上传 

原因是：上传以后没有清空前一次 `file` 选择的文件，所以就没有触发 `onchange` 事件。

### 3、校验框架失效，第一次未上传会提示：“请上传文件”，以后就不会提示了

原因是：同第一个问题，都是由于 `clone()` 以后之前绑定的校验方法丢失了。

## 当前框架的坑

### AjaxFileUpload 框架

**options**

`fileElementId` 指定file的ID。

**说明：**

上传组件直接指定ID，明显不合理！因为看它源码里，使用了 `clone()`，所以，直接制定ID的话，上文中提到的3个问题，全部会遇到，不合理。

**改进：**

使用jquery的事件委托机制，通过指定file的父容器，来代理file进行操作，这样即使克隆了，都是同一个父元素，相关的事件依然生效。

比如：

```js
$('#fileParent file').xxx
$('#fileParent').on(':file','xxx',function(){});
```

这时候的`options`就可以直接传递一个对象，或者一个file的父容器。

比如，我将 `fileElementId` 属性直接改为 `$fileElementParent`，就是一个父容器的jQuery对象。

有需要的可以：[下载](https://github.com/sunmaobin/sunmaobin.github.io/tree/master\_attachment\20161109110810\ajaxfileupload.hack.js)

### jQuery File Upload 说明

总体而言，这个框架比 `AjaxFileUpload` 强大的很多。

**options**

`replaceFileInput` 是否替换当前file，默认：true，也就是默认情况下每次使用 `clone()` 替换旧的file。如果这个值设置为false，那么就会出现上文中 `问题2` 的情况，建议保持true。
`formData` 上传时的参数，默认取得file所在form所有的参数，可以自己定义仅仅取得自己想要的参数传递，看看API就可以了。

当然这个框架的功能还很多，比如：各种状态下的事件回调，跨域处理，进度条等等，大家去研究下API。 

（全文完）

## 参考

