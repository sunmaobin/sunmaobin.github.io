

# 经验分享-Array.sort高级用法

最近在使用数组排序的时候，一不小心犯了一个低级错误，分享一下，大家引以为戒。同时，提供一种能应对数组中含有各种特殊符号的排序方式。

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
//结果：[13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1]
```

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

## 深入

其实，一般的排序都是针对 `数字` 的，也就是可以相加减，那么比较起来就比较直观，但是有时候我们排序的内容有可能不只是纯数字，里面可能有字母，甚至**中文**，这时候怎么办？

JS有个方法：`localeCompare`，用法参考：[https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare)

这个方法就是提供本地化的比较方案，详细的使用说明，大家可以看看上面的文档，这里给出一种数组中含有中文、英文、数字、汉字等字符时的通用比较方案。

先给出一组比较复杂的数组：

```js
let testAry = [100,'汉字','中文','澳门',200,'Admin',30,'Lisa',undefined,null,'','%','&'];
```

先使用传统的方式：

```js
testAry.sort(function(a,b){
    return a - b;
});
//["", null, 30, "澳门", 100, "Admin", "汉字", "Lisa", "&", "中文", 200, "%", undefined]
```

当各种情况混合到一起的时候，传统的相减的比较，完全不能达到要求，下来我们看看使用 `localeCompare`的方案：

```js
testAry.sort(function(a,b){
    var r = a - b;
    if(isNaN(r)){
        r = String(a).localeCompare(String(b), 'zh-CN', {sensitivity: 'accent'});
    };
    return r;
});
//["", "&", "%", null, 30, 100, 200, "澳门", "汉字", "中文", "Admin", "Lisa", undefined]
```

结果明显要好很多，至少除了特殊字符，中英文和数字都是合理的排序，我们稍微改进下，让其按照如下的规则排序，就完美了：

* 排序顺序：数字 —> 英文 —> 中文 —> 特殊字符 —> 其它
* 数字：从小到大
* 英文：按字母顺序
* 中文：按拼音的字母顺序

其实，就是将排好序的数组，重新处理下就好了，增加一个方法：

```js
function arySort(ary){
    ary.forEach(function(d){
        if(!d && d !== 0){
            ary.a = ary.a || [];
            ary.a.push(d);
            return true;
        };
        if(/\d+/.test(d)){
            ary.b = ary.b || [];
            ary.b.push(d);
            return true;
        };

        if(/[a-zA-Z]+/.test(d)){
            ary.c = ary.c || [];
            ary.c.push(d);
            return true;
        };

        //注意：汉字的正则不推荐：/[\u4e00-\u9fa5]/
        //参考：https://zhuanlan.zhihu.com/p/33335629
        if(/\p{Unified_Ideograph}/u.test(d)){
            ary.d = ary.d || [];
            ary.d.push(d);
            return true;
        };

        ary.e = ary.e || [];
        ary.e.push(d);
    });
    
    return [].concat(ary.b || [])
        	.concat(ary.c || [])
        	.concat(ary.d || [])
        	.concat(ary.e || [])
        	.concat(ary.a || [])
};
```

完整的解决方案代码：

```js
let testAry = [100,'汉字','中文','澳门',200,'Admin',30,'Lisa',undefined,null,'','%','&'];

function arySort(ary){
    //重新定义ary，不污染外部数组
    ary = [].concat(ary);
    
    //使用localeCompare排序
    ary.sort(function(a,b){
        var r = a - b;
        if(isNaN(r)){
            r = String(a).localeCompare(String(b), 'zh-CN', {sensitivity: 'accent'});
        };
        return r;
    });
    
    //将排序后的数组重新分类
    ary.forEach(function(d){
        if(!d && d !== 0){
            ary.a = ary.a || [];
            ary.a.push(d);
            return true;
        };
        if(/\d+/.test(d)){
            ary.b = ary.b || [];
            ary.b.push(d);
            return true;
        };

        if(/[a-zA-Z]+/.test(d)){
            ary.c = ary.c || [];
            ary.c.push(d);
            return true;
        };

        if(/\p{Unified_Ideograph}/u.test(d)){
            ary.d = ary.d || [];
            ary.d.push(d);
            return true;
        };

        ary.e = ary.e || [];
        ary.e.push(d);
    });
    
    return [].concat(ary.b || [])
        	.concat(ary.c || [])
        	.concat(ary.d || [])
        	.concat(ary.e || [])
        	.concat(ary.a || [])
};

let result = arySort(testAry);
//[30, 100, 200, "Admin", "Lisa", "澳门", "汉字", "中文", "&", "%", "", null, undefined]
```

下面再验证几个典型的场景：

1. 纯数字

   ```js
   arySort([100,22,0,3,10001])
   //[0, 3, 22, 100, 10001]
   ```
   > 注意：这里容易出现的错误就是 22 \> 100
   > 原因是把这2个按照字符串比较，这样100就排在22前面了。

2. 纯英文

   ```js
   arySort(['hello','world','array','alert','boy','girl'])
   //["alert", "array", "boy", "girl", "hello", "world"]
   ```
   > 注意：alert 和 array，首字母相同时，比较第2个字符，依次类推，这就是字典顺序。

3. 纯中文

   ```js
   arySort(['你好','我们','中国人','比较','腼腆','害羞','奥运'])
   //["奥运", "比较", "害羞", "腼腆", "你好", "我们", "中国人"]
   ```

4. 数字和英文

   ```js
   arySort([100,22,'array','sort',35,'lisa','vivo'])
   //[22, 35, 100, "array", "lisa", "sort", "vivo"]
   ```

5. 中英文和数字

   ```js
   [22, 35, 100, "array", "lisa", "sort", "vivo", "日本", "中国"]
   ```

## 感悟

* 基础很重要，要时不时翻翻API，看看书；
* 遇到模糊的概念，最好先翻翻API再下手。

## 参考

* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
* https://stackoverflow.com/questions/24080785/sorting-in-javascript-shouldnt-returning-a-boolean-be-enough-for-a-comparison
* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare
* https://stackoverflow.com/questions/19101573/how-can-one-compare-string-and-numeric-values-respecting-negative-values-with?utm_medium=organic&utm_source=google_rich_qa&utm_campaign=google_rich_qa
* https://zhuanlan.zhihu.com/p/33335629