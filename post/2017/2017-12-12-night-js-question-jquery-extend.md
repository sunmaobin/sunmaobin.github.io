# 经验分享-jQuery.extend使用注意

## 问题

最近项目中有个需求，就是查询条件可以动态追加，也就是有个按钮，点击后增加查询条件，比如：查询条件中有个select，点击添加，就多一个select。

于是出现的问题是，添加一个select，option的默认值就是上一个select中选中的值，而不是默认选择第一个！

## 原因

实现思路大致为：

1. 将select中的值放到一个数组list中；
1. 每次新增select，就copy这个数组的内容，然后绑定到mvvm框架的vm对象上
1. 前端渲染出来，同时增加双向绑定功能

大致实现思路是：

```js
var ary = {
    type1 : [{
            id : 1,
            name : 'name1'
        },{
            id : 2,
            name : 'name2'
        }],
    type2 : [{
            id : 3,
            name : 'name3'
        },{
            id : 4,
            name : 'name4'
        }]
};

var vm1 = $.extend({},ary);

```

页面上使用的是MVVM框架 `avalon` 的双工绑定 `duplex`。

问题就出现在：

```js
var vm1 = $.extend({},ary);
```

看下文的分析。

## 分析

先来看看 `jQuery.extend` 的用法：

```js
//通过递归的方式，将a对象的所有属性复制到b对象上
$.extend(true, b, a);

//如果不使用递归，而是浅拷贝，则：
$.extend(b, a);
```

* 而上面直接使用浅拷贝复制一个对象，也就是每次给 `vm1` 赋值的时候，其实是 `ary` 对象的一级节点的引用！
* 最后这个对象绑定到select中，而页面上变化后，会改变这个对象，其实就间接影响到了 `ary` 对象。
* 所以，下次新增的时候，在使用这个 `ary` 模板的时候，其实已经被更改了。

所以，这个问题最根本的解决办法就是使用深拷贝，即：

```js
var vm1 = $.extend(true,{},ary);
```

## 补充

* ES6的 `Object.assign` 也是浅拷贝，请注意使用。
    * 参考：https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
* 要实现 `Object.assign` 的深拷贝，可以自己写方法
    * 参考：https://stackoverflow.com/questions/27936772/how-to-deep-merge-instead-of-shallow-merge
* `jQuery.extend` 的源代码，jquery源码中搜索：`jQuery.extend`
    * 访问：https://cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.js
