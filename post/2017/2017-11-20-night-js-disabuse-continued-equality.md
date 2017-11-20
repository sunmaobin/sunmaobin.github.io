# JS解惑-连等表达式

## 问题

如下3个表达式的区别：

```js
//sample1
var str = 123;
var str1 = 123;
var str2 = 123;

//sample2
var str = 123,str1 = 123,str2 = 123;

//sample3
var str = str1 = str2 = 123;
```

## 答案

```js

//`sample1` = `sample2`，区别仅仅是代码风格而已；

//sample2
var str = 123,str1 = 123,str2 = 123; //str,str1,str2 全部为局部变量

//sample3
var str = str1 = str2 = 123; //str 局部变量，str1,str2 为全局变量

```

![](https://i.imgur.com/0xEVKKl.jpg)

（全文完）
