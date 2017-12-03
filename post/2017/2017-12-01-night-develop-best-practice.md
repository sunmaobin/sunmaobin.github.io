# 经验分享-提高生产效率的一些编码技巧

本文包含了一些个人开发经验总结和设计模式的总结，希望能给大家有所帮助。

## 条件语句if使用技巧

将代码少的逻辑放到if中，而更多的逻辑当成正常系处理，更有利于阅读和理解。

### 方法

原始代码：

```js
if(condition){
    //中间有100行代码
}else{
    //这里只有1行代码！
};
```

以上逻辑最好的书写规范是：

```js
if(!condition){
    //1行代码！
    return;
};

//剩余100行代码
```

### 案例

原始代码：

```js
selectCategory : function(categoryId, isRedirect) {
    if (categoryId) {
        $('#userPersonasTagDrop .input-group').hide();
        $('#tagSubCategory').addClass('subcategory-not-all').show();
        
        walleUtilStorage.setItem(this.storageLocalCategoryId, categoryId);
        walleUtilStorage.setItem(this.storageLocalTagId, '');
        
        isRedirect      // 比如从收藏夹跳转过来
            ? $('#tagSubCategory span:first').text(this.model.queryParam.tagName)
            : $('#tagSubCategory span:first').text('请选择标签');
        isRedirect || this._getPersonasTagList(categoryId, '', true);
        
    } else {
        $('#userPersonasTagDrop .input-group').show();
        $('#tagSubCategory').hide();
        $('#collectBtn').attr('disabled');
        $('.item-group-search').attr('disabled');
    }
}
```

优化后：

```js
selectCategory : function(categoryId, isRedirect) {
    //优化1
    if (!categoryId) {
        $('#userPersonasTagDrop .input-group').show();
        $('#tagSubCategory').hide();
        $('#collectBtn').attr('disabled');
        $('.item-group-search').attr('disabled');
        return;
    };
    
    $('#userPersonasTagDrop .input-group').hide();
    $('#tagSubCategory').addClass('subcategory-not-all').show();
    
    walleUtilStorage.setItem(this.storageLocalCategoryId, categoryId);
    walleUtilStorage.setItem(this.storageLocalTagId, '');
    
    //优化2
    if(!isRedirect){
        $('#tagSubCategory span:first').text('请选择标签');
        return;
    };
    
    $('#tagSubCategory span:first').text(this.model.queryParam.tagName)
    this._getPersonasTagList(categoryId, '', true);
}
```

### 参考

* 代码大全，第15章

![](https://i.imgur.com/g4w0Gz0.png)


## 重复语句for循环化（表驱动法）

代码中发现有太多重复的语句，看似相同，但是又有些不同，于是乎就本能的习惯使用if语句写一大片！

其实最好的做法是代码去重！

核心的思想： `就是想尽一切办法将相似的部分放到一个对象或者数组中，然后循环处理。`

### 示例1

显示一年内各个月的天数。

* 最low的写法：

```js
function getDaysByMonth(month){
    var days = 0;    
    if(month == 1){
        days = 31;
    }else if(month == 2){
        days = 28; // 不用考虑闰年的情况
    }else if(month == 3){
        days = 31；
    }else if(...){
        ...
    };
    return days;
};
```

* 采用表驱动法的思路

```js

function getDaysByMonth(month){
    //创建一张表
    var daysAry = [31,28,31,30,31,30,31,31,30,31,30,31];
    return daysAry[month];
};

```

### 示例2

原始代码：

```js
if (currentIdx === model.TAB_SYSTEM) { model.searchKeyWd.systemKeyWd = $searchInput.val(); }
if (currentIdx === model.TAB_MODULE) { model.searchKeyWd.moduleKeyWd = $searchInput.val(); }
if (currentIdx === model.TAB_AUTH) { model.searchKeyWd.authKeyWd = $searchInput.val(); }
```

优化：

```js
var mapper = [{
    key : model.TAB_SYSTEM,
    model : model.searchKeyWd.systemKeyWd
},{
    key : model.TAB_MODULE,
    model : model.searchKeyWd.moduleKeyWd
},{
    key : model.TAB_AUTH,
    model : model.searchKeyWd.authKeyWd
}];

for(var i=0,size=mapper.length;i<size;i++){
    var obj = mapper[i];
    if(currentIdx === obj.key){
        obj.model = $searchInput.val();
    };
};

```

### 示例3

原始代码：

```js
function fun1(){
    confirmTodoObj.todo === todoType.SYSTEM_UPDATE && result && result();
    confirmTodoObj.todo === todoType.MODULE_UPDATE && result && result();
    confirmTodoObj.todo === todoType.AUTH_UPDATE   && result && result();
    confirmTodoObj.todo === todoType.SYSTEM_ADD    && result && result();
    confirmTodoObj.todo === todoType.MODULE_ADD    && result && result();
    confirmTodoObj.todo === todoType.AUTH_ADD      && result && result();
}
```

优化1：

```js
function fun1(){
    if(!result){
        return;
    };
    
    if(confirmTodoObj.todo === todoType.SYSTEM_UPDATE
        || confirmTodoObj.todo === todoType.MODULE_UPDATE
        || confirmTodoObj.todo === todoType.AUTH_UPDATE
        || confirmTodoObj.todo === todoType.SYSTEM_ADD
        || confirmTodoObj.todo === todoType.MODULE_ADD
        || confirmTodoObj.todo === todoType.AUTH_ADD){
    
        result();
    };
}
```

优化2：

```js
function fun1(){
    if(!result){
    return;
};

switch(confirmTodoObj.todo){
    case todoType.SYSTEM_UPDATE:
    case todoType.AUTH_UPDATE:
    case todoType.SYSTEM_ADD:
    case todoType.MODULE_ADD:
    case todoType.AUTH_ADD:
        result();
        break;
};
```

最终优化：

```js
function fun1(){
    if(!result){
        return;
    };
    
    var checkKeyList = [
        'SYSTEM_UPDATE',
        'AUTH_UPDATE',
        'SYSTEM_ADD',
        'MODULE_ADD',
        'AUTH_ADD'
    ];
    
    for(var i=0,size=checkKeyList.length; i<size; i++){
        if(confirmTodoObj.todo === todoType[checkKeyList[i]]){
            result();
        };
    };
}
```

### 参考

* 代码大全，第18章

![](https://i.imgur.com/5P5lL15.png)

## （jQuery）避免手动拼接URL参数

在 `get` 请求时，很多人习惯手动拼接url参数，比如：

```js
var queryParam = 'val1='+val1+'&val2='+val2+'&val3='+val3;
var getUrl = url + '?' + queryParam;
```

推荐使用 `jQuery` 的 `$.param()` 方法，或者其它库提供的类似方法。

```js
var queryParam = {
    val1 : val1,
    val2 : val2,
    val3 : val3
};

var getUrl = url + '?' + $.param(queryParam);

```

> 详细说明：http://api.jquery.com/jquery.param

## （jQuery）对象复制或合并

假如有对象 `a` 和 对象 `b`，要实现如下功能：

1. 将 `a` 的属性复制到 `b` 对象上；
1. 将 `a` 和 `b` 合并成新对象 `c`;

推荐使用 `jQuery` 的 `$.extend()` 方法，或者其它库提供的类似方法。

`a` 和 `b` 对象分别如下：

```js
var a = {
    apple: 0,
    banana: { 
        weight: 52, 
        price: 100 
    },
    cherry: 97
};

var b = {
    banana: {
        price: 200
    },
    durian: 100
};

```

目标1：将 `a` 的属性复制到 `b` 对象上：

```js
//通过递归的方式，将a对象的所有属性复制到b对象上
$.extend(true, b, a);

//如果不使用递归，而是浅拷贝，则：
$.extend(b, a);
```

目标2：将 `a` 和 `b` 合并成新对象 `c`;

```js
//通过递归的方式，将a对象的所有属性复制到b对象上
var c = $.extend(true, {}, b, a);

//如果不使用递归，而是浅拷贝，则：
var c = $.extend({}, b, a);
```

> 详细说明：http://api.jquery.com/jquery.extend

> 思考：如果自己实现以上方式，该怎么写？PS：需要考虑深拷贝和浅拷贝的问题；写出来可以与jQuery源码对比下。

## 三元表达式（Conditional (ternary) Operator）

三元表达式规则：

```
condition ? expr1 : expr2 
```

使用三元表达式能简化代码结构，能少写一组 `if/else`。

示例

```js
var str = ture ? 'yes' : 'no';
```

## `OR` 短路操作符 `Short-Circuits`

短路操作符规则：

```
//If exp1 is true then exp2
exp1 || exp2
```

```js
var a = b || 1;
```

翻译过来如下：

```js
if(b){
    a = b;
}else{
    a = 1;
};
```

> 只所以可以这么写，原因是js是一门弱类型语言，每个变量默认都默认继承一个 true 或者 false 值，称之为：truthy 或者 falsy！
> 参考：https://www.sitepoint.com/javascript-truthy-falsy/

## `&&` 条件判断

与短路操作类似，还有一种写法如下：

```js
var a = b && 1;
```

翻译过来如下：

```js
if(b) {
    a = 1;
}else{
    a = b;
};
```

## 更多JS中的一些常用的快速写法

* 获取时间戳

```js
//传统写法
var timestamp = new Date().getTime(); //1512113674165

//快速写法
var timestamp = +new Date(); //1512113674165
```

* 浮点数取整

```js
//传统写法
var var1 = parseInt(11.6); //11

//快速写法
var var1 = ~~11.6; //11

//不常用，但是可以
var var1 = 11.6 | 0; //11
```

> 位操作符 `~`： https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators#Bitwise_NOT
> 位操作符 `|` ： https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators#Bitwise_OR
> `~~`解惑：http://rocha.la/JavaScript-bitwise-operators-in-practice


* 科学计数法

```js
//传统写法
for(var i=0;i<10000;i++){};

//快速写法
for(var i=0;i<1e4;i++){};
```

* 获取随机码

```js
Math.random().toString(16).substring(2); //13位，如：7c4a0278b4509
Math.random().toString(36).substring(2); //11位，如：5b1chmfvhmo
```

* 合并两个数组

```js
var a = [1,2,3];
var b = [4,5,6];
Array.prototype.push.apply(a, b);
console.log(a); //[1,2,3,4,5,6]
```

* 不增加变量交换两个值

```js
a= [b, b=a][0];
```

* 获取数组的最大和最小值

```js
Math.max.apply(Math, [1,2,3]) //3
Math.min.apply(Math, [1,2,3]) //1
```


## 推荐书籍

> 虽然这本书的示例代码都是VB写的，但是思想非常实用，建议大家都看下。

![](https://i.imgur.com/kaDewJ3.png)
 



