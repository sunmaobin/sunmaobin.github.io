# JS解惑-如何阻止事件冒泡和取消默认行为

## 什么是事件冒泡？

要了解事件冒泡，我们就得把它跟事件捕获来一起交代！

### 一组栗子

```
<div id="d1">
    <p id="p1">
        <span id="s1">
            Click Here
        </span>
    </p>
</div>
```

加入我给如上HTML的三级标签上都加上Click事件：

```
//注意这里的最后一个参数，默认也是false
document.getElementById('d1').addEventListener('click',function(e){
    console.log('d1');   
},false);

document.getElementById('p1').addEventListener('click',function(e){
    console.log('p1');   
},false);

document.getElementById('s1').addEventListener('click',function(e){
    console.log('s1');   
},false);
```

当点击页面上的 `Click Here` 的文字时，控制台会依次打印：

```
s1
p1
d1
```

也就是这3个事件的触发是由内层标签开始朝外依次进行的。

如果这时候修改一下事件绑定的方式，如下：

```
//最后一个参数修改为true
document.getElementById('d1').addEventListener('click',function(e){
    console.log('d1');   
},true);

document.getElementById('p1').addEventListener('click',function(e){
    console.log('p1');   
},true);

document.getElementById('s1').addEventListener('click',function(e){
    console.log('s1');   
},true);
```

再次点击页面上的 `Click Here` 的文字时，控制台会依次打印：

```
d1
p1
s1
```

### 原因解释

* `addEventListener` 的参数说明：[https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener](https://developer.mozilla.org/zh-CN/docs/Web/API/EventTarget/addEventListener)

* 如文档中所说的，其实就是 `useCapture` 这个参数：`true` 表示事件捕获， `false` 表示事件冒泡，默认是冒泡

* 如下图是对 `事件捕获` 和 `事件冒泡` 的进一步说明

![](https://i.imgur.com/uG5tV1w.png)

## 如何阻止事件冒泡

> 先说明下，IE旧的浏览器对于事件的定义不同（<=IE8），所以当你使用旧浏览器的时候，务必考虑兼容性！

```
function stopPropagation(e){
    if(e && e.stopPropagation){//支持W3C的stopPropagation()方法
        e.stopPropagation();
        return;
    };

    if(window.event){//<=IE8,取消事件冒泡
        window.event.cancelBubble = true;
    };
}
```

## 什么是默认行为？

看一些栗子：

* `<a>` 标签，我们点击以后默认会跳转到 `href`属性配置的地址去，这就是 `<a>` 的默认行为；
* `<input type="submit">` 如果放在 `<form>` 标签中，点击后默认会提交该 `<form>` 表单，这就是 `<input type="submit">` 的默认行为；


## 如何阻止默认行为？

```
function stopDefault(e){
    if(e && e.preventDefault){//支持W3C的preventDefault()方法
        e.preventDefault();
        return;
    };

    if(window.event){//<=IE8,阻止默认行为
        window.event.returnValue = true;
    };
}
```

## 总结

### 支持W3C标准

* 阻止冒泡：`e.stopPropagation`
* 阻止默认行为：`e.preventDefault`

### IE8及以下非W3C标准

* 阻止冒泡：`window.event.cancelBubble = true`
* 阻止默认行为：`window.event.returnValue = true`

## 补充

使用jQuery的事件方法，直接使用 `return false` 既可以阻止冒泡也可以阻止默认行为

```
$(ele).click(function(){
    //...

    //阻止冒泡和默认行为
    return false;
});
```


（全文完）
