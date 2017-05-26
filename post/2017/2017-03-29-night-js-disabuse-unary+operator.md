# JS解惑-一元操作符+操作

你知道 `+new Date()` 结果等于多少吗？

## 背景

昨天看到一种书写方式，当时就有点懵，写法如下：

```js
var time = +new Date();
```

好奇之，就Google了一下，豁然开朗，于是分享之……

## 结果

以上代码，等于如下代码：

```js
function(){
   return Number(new Date);
}
```

所以，结果其实就是 `当前时间的时间戳`，也等于如下结果：

```js
new Date().getTime();//20170329205038
```

## 引申

`+` 可以与以下类型进行运算：

* undefined
* null
* Object
* Array
* Boolean
* Date
* String

结果如下：

### +undefined

+undefined = NaN（Not As Number的意思）

**扩展：** undefined 和其它任何值进行任何运算结果都是NaN，比如：1+undefined，6*undefined等

### +null

* +null = 0 （为什么？看看这里：[undefine和null的区别](http://www.night123.com/2016/night-js-disabuse-undefined-vs-null/)）

**扩展：** 1+null = 1

### +Object

* +{} = NaN
* +new Object(1) = 1 （其实就等于+new Number(1) = +1）

### +Array

* +new Array(1) = undefined （申明一个1维的空数组，第1个元素的值未定义，+一维数子就 = +数组中的第一个元素）
* +[2] = 2（其实等于+2，所以结果就等于2）
* +[2,3] = NaN（如果是多维数组，那么：+数组 = +对象 = NaN）

**扩展：** +[2,3][1] = 3（相当等于 +3 = 3）

## +Boolean

* +true = 1
* +false = 0
* +new Boolean(1) = 1
* +new Boolean(0) = 0

## +Date

* +new Date() = 20170329213914 （等于 new Date().getTime()）
* +new Date = 20170329213914 （补充一下：其实构造函数可以简写，也就是可以不带括号，语法是正确的，只是这种写法我们不提倡）
* +new Date(1) = 1 （其实 new Date(1).getTime() = 1）

## +String

* +'' = 0
* +'1' = 1
* +'a' = NaN

其实，+String我们经常见，就是把String转换为数子然后操作，如果无法转换为数字，那么结果就是NaN啦！

## 参考

* [What does the plus sign do in '+new Date'](http://stackoverflow.com/questions/221539/what-does-the-plus-sign-do-in-new-date)
* [The unary + operator](http://xkr.us/articles/javascript/unary-add/)
* [Unary plus (+)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Arithmetic_Operators#Unary_plus)
* [Constructor, operator "new"](http://javascript.info/constructor-new)

（全文完）
