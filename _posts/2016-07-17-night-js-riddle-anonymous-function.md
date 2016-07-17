---

title: JS谜题-函数中的函数
date: 20160717160430
categories: [谜题]
tags: [js]

---

请问以下结果能否在点击button后，延迟3秒打印结果？

```html
<html>
<body>
<button id="btn">Click</button>
<script src="jquery.js"></script>
<script>
(function(){
    var delayFun = function () {
       alert("This is sample function");
    };

    $("#btn").click(function(){
        setTimeout("delayFun",3000);
    });
})();
</script>
</body>
</html>
```
## 答案

不能。

## 原因

由于delayFun在一个匿名函数中定义，外部无法访问。而setTimeout已经脱离了当前执行环境，它的环境是window，所以3S后从window中找不到delayFun。

## 延伸

如果这里去掉setTimeout，即：

```js
$("#btn").click(function(){
    delayFun();
});
```
点击button能立即打印结果吗？

答案：可以。

原因：click回调函数是在最外层的匿名函数中，也就是函数中的函数（即：闭包），闭包有访问外层函数中变量的权利。
