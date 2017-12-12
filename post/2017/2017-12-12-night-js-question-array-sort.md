# 经验分享-Array.sort使用注意

最近在使用数组排序的时候，一不小心犯了一个低级错误，分享一下，大家引以为戒。

## 问题

在项目中需要将一个数组排序，于是我大致就是这么写的：

```js
//示例，由大到小排序
var ary = [1,3,5,4];
ary.sort(function(a,b){
    return a < b;
});
//结果：[5,4,3,1]
```

由于忘记自定义sort函数了，简单在控制台Console里跑了一下，这个是OK的，于是代码就这么去写了，没想到就出问题了。。。

问题是什么呢？看下面的例子：

```js
var ary = [5, 8, 7, 1, 2, 3, 4, 6, 9, 10, 11, 12, 13];
ary.sort(function(a,b){
    return a < b;
});
//结果：[4, 13, 6, 7, 12, 11, 8, 10, 9, 5, 3, 2, 1]
```

结果就开始出问题了！

## 原因

于是仔细看 `Array.sort` 的API才发现自定义sort函数的返回值并不是 `true` or `false`：

* `> 0` when a is considered larger than b and should be sorted after it
* `== 0` when a is considered equal to b and it doesn't matter which comes first
* `< 0` when a is considered smaller than b and should be sorted before it

也就是说返回：正数、负数和0！

## 解决

```js
var ary = [5, 8, 7, 1, 2, 3, 4, 6, 9, 10, 11, 12, 13];
ary.sort(function(a,b){
    if (a < b) return 1;
    if (a > b) return -1;
    /* else */ return 0;
});
//结果：[4, 13, 6, 7, 12, 11, 8, 10, 9, 5, 3, 2, 1]
```

## 扩展

上面还有一种简写方法，就是：

```js
ary.sort(function(a,b){
   return b-a;
});
```

但是这种做法一定要保证数组中全部是 `number` 类型的，才可以这么简写，要不然最好在function中判断下再处理。

比如：

```js
["5", "8", "7", "string", undefined, "3", {}, "6", null, "10", "11", "12", "13"].sort(function(a, b) {
    return a - b;
});
//结果：[null, "3", "5", "6", "7", "8", "10", "11", "12", "string", "13", {…}, undefined]
```

## 感悟

* 基础很重要，要时不时翻翻API，看看书；
* 遇到模糊的概念，最好先翻翻API再下手。

## 参考

* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
* https://stackoverflow.com/questions/24080785/sorting-in-javascript-shouldnt-returning-a-boolean-be-enough-for-a-comparison