# js解惑-函数执行顺序

## 背景

JS基础知识温习。

## 函数解析原理

分3个阶段：

1. 准备（Hoisting）
1. 装载（填充数据）
1. 执行（逐行处理）

### 准备

本阶段就是书本中所说的Hoisting，包括：`形参变量创建`、`函数体内变量提升创建` 和 `函数申明创建`。

就是先把函数中所有的变量或者声明的函数名都先定义好，空间都开辟好。

**关于准备阶段的特别说明：**

1. 如果变量已经定义过，则不会重新定义（比如：形参中有个参数a，并且调用函数时传了值进来，这时候函数中还有个变量a，那么在这一阶段，函数中的变量a是不会重新定义，形参中的值也不会被覆盖。）；

### 装载

这里装载填充的数据包括：`形参` 和 `申明的函数体`。

也许你要问了，为什么一般的变量只是拿到前面定义好，此时值是 `undefined`，填充数据需要等到执行那一行才进行，而 `形参` 和 `申明的函数` 在代码执行前就要装载好呢？

**答：** 我个人的理解是（有更专业的解释，欢迎批评指针啊）：

* `形参` 是外部传进来的，是函数在执行前就已经知道的数据，所以直接就装载上；而对于函数中普通的变量，受限于JS解析顺序的机制影响，只能等到具体执行到那一行时才能知道。
* `函数申明` 为什么要放到前面去呢？这应该也是JS的策略吧，不然函数表达式（var xxx=fn）为啥就没这个待遇呢？

**关于装载的特别说明：**

1. 数据装载的数据为：`函数形参` > `函数申明`；
1. 对于函数声明装载时，如果已经有相同的函数名的话，会覆盖前面的（比如：形参中有个参数a，并且外部给他赋了值，这时候函数中如果有个函数申明a，那么在这一阶段，形参中的a就会被覆盖为这个函数）。

### 执行

通过上面的2个阶段，大家就知道，当函数真正一行行开始执行的时候，其实有些值已经存在了，并不是大家想象中的全部为 `undefined`。

本阶段就是纯粹的执行代码了，执行就包括了：变量赋值、对象调用等等。

但是本阶段其实JS引擎还做了另外一件事情，就是：`代码检查`。如果报错了，会直接中断程序，除非使用 `try/catch` 捕获。

## 示例一

```js
function test() {
    console.log('1、a=',a);
    var a = b = 123;
    console.log('2、a=',a);
    console.log('3、b=',b);
};
test();
console.log('4、b=',b);
console.log('5、a=',a);
```

### 分析

#### 第一步：准备

变量提升（Hoisting），这一步执行后，实际的代码变为：

```js
function test() {
    var a;
    console.log('1、a=',a);
    b=123;
    a=b;
    console.log('2、a=',a);
    console.log('3、b=',b);
};
test();
console.log('4、b=',b);
console.log('5、a=',a);
```

**补充说明：** 关于 `var a = b = 123` 的解释，请移步： [JS解惑-连等表达式](https://github.com/sunmaobin/sunmaobin.github.io/issues/39)

#### 第二步：装载

由于函数没有形参和函数申明，所以该步直接跳过。

#### 第三步：执行

```js
//1 var a;
//2 console.log('1、a=',a);
//3 b=123;
//4 a=b;
//5 console.log('2、a=',a);
//6 console.log('3、b=',b);
```

* //1 变量定义：a，默认值：`undefined`；
* //2 打印变量：a，输出：`1、a= undefined`；
* //3 给变量b赋值为123，由于变量b在test函数中未定义，所以js引擎就会默认在全局对象`window`所对应的对象下面创建属性b，并且为其赋值为123，window.b=123；
* //4 将b的值赋给a，这时候a就等于123，a=123；
* //5 打印变量：a，输出：`2、a= 123`；
* //6 打印变量：b，输出：`3、b= 123`；

#### 最后：函数执行完后，局部变量立即销毁，全局变量仍然保留。

```js
//7 console.log('4、b=',b);
//8 console.log('5、a=',a);
```

* //7 由于b为全局变量，执行完函数后未被销毁，所以输出：`4、b= 123`；
* //8 由于a在函数执行后已经销毁，而全局变量又没有a，所以打印时就报错了；

### 最终结果

![](https://i.imgur.com/yXTTL3R.png)

**补充说明：**错误类型为 `ReferenceError` 引用错误，也就是说系统根本不知道哪个对象或者函数下面的属性a，所以会报这个错误。如果这时候你打印 `window.a`，那么结果将是 `undefined` 而不会报错。

## 示例二

```js
function test(a) {
    console.log('1、a=',a);
    var a=123;
    console.log('2、a=',a);
    function a(){};
    console.log('3、a=',a);
};
test(1);
```

### 分析

#### 第一步：准备

定义变量a，代码变为：

```js
function test(a) {
    var a；
    console.log('1、a=',a);
    a=123;
    console.log('2、a=',a);
    function a(){};
    console.log('3、a=',a);
};
```

#### 第二步：装载

1. 先将形参的值1赋值给a，a=1；
1. 将函数申明赋值给a,a=function(){};

装载完毕后，代码变为：

```js
function test(a) {
    var a = function(){};
    console.log('1、a=',a);
    a=123;
    console.log('2、a=',a);
    console.log('3、a=',a);
};
```

#### 第三步：执行

看到第二步装载完毕后的代码，那么结果也就很清楚了。

![](https://i.imgur.com/BO4oCm9.png)

### 最终结果

![](https://i.imgur.com/peziaNS.png)

## 示例三

```js
function test(a,b){
    console.log('1、a=',a);
    c=0;
    var c;
    console.log('2、c=',c);
    a=3;
    b=2;
    console.log('3、b=',b);
    function b(){};
    function d(){};
    console.log('4、b=',b);
};
test(1);
```

### 分析

#### 准备

找到所有的局部变量，注意包含形参中的，包括：

* a，来自：形参
* b，来自：形参、函数申明
* c，来自：局部变量
* d，来自：函数申明

于是原函数就变为：

```js
function test(a,b){
    var a;
    var b;
    var c;
    var d;

    console.log('1、a=',a);
    c=0;
    console.log('2、c=',c);
    a=3;
    b=2;
    console.log('3、b=',b);
    function b(){};
    function d(){};
    console.log('4、b=',b);
};
test(1);
```

#### 装载

注意装载的顺序：形参先装载，其次是函数声明，而且函数申明会覆盖已定义的变量。

于是函数就变成为：

```js
function test(){
    var a=1;
    var b=function(){};//实参并没有传第2个参数，默认为undefined；但后来又被函数申明覆盖了。
    var c=undefined;//没有地方为其赋值
    var d=function(){};

    console.log('1、a=',a);
    c=0;
    console.log('2、c=',c);
    a=3;
    b=2;
    console.log('3、b=',b);
    console.log('4、b=',b);
};
test(1);
```

#### 执行

先看看装载后的函数的执行结果：

![](https://i.imgur.com/pT5IPXq.png)

所以，其实这类题目最难的就是分析阶段，包括：（准备、装载），一旦这2个阶段处理好，执行阶段基本就是直接打印结果了。

### 最终结果

![](https://i.imgur.com/rxLXcO9.png)

## 示例四

最后一道带一些逻辑，可能会影响到分析阶段的。

```js
function test(a,b){
    console.log('2、b=',b);
    if(a){
        var b=100;
    };
    console.log('3、b=',b);
    c=456;
    console.log('4、c=',c);
};
var a;
console.log('1、a=',a);
test();
a=10;
console.log('5、a=',a);
console.log('6、c=',c);
```

### 分析

#### 准备

这类题目，先不用管函数体外的代码，因为函数准备和装载，跟外部代码怎么执行没关系。

* a，来自形参、局部变量；
* b，来自形参、局部变量；（注意：函数的准备阶段，是不用管是否有if的，只要看到var b，就一定会提前）

对于变量前没有var申明的，说明是全局变量，不用理会。

于是代码变为：

```js
function test(a,b){
    var a;
    var b;

    console.log('2、b=',b);
    if(a){
        b=100;
    };
    console.log('3、b=',b);
    c=456;
    console.log('4、c=',c);
};
var a;
console.log('1、a=',a);
test();
a=10;
console.log('5、a=',a);
console.log('6、c=',c);
```

#### 装载

装载阶段依然只管函数体内。

```js
function test(){
    var a=undefined;
    var b=undefined;

    console.log('2、b=',b);
    if(a){
        b=100;
    };
    console.log('3、b=',b);
    c=456;
    console.log('4、c=',c);
};
var a;
console.log('1、a=',a);
test();
a=10;
console.log('5、a=',a);
console.log('6、c=',c);
```

#### 执行

先增加一个行号：

```js
function test(){
      var a=undefined;
      var b=undefined;

//7   console.log('2、b=',b);
      if(a){
         b=100;
      };
//8   console.log('3、b=',b);
      c=456;
//9   console.log('4、c=',c);
};
//1 var a;
//2 console.log('1、a=',a);
//3 test();
//4 a=10;
//5 console.log('5、a=',a);
//6 console.log('6、c=',c);
```

* 第1行、第2行，由于没有test参与，所以结果直接就打印：a=undefined;
* 第3行开始进入函数体内；
* 第7行，b=undefined；
* 第8行，因为上方if(a)条件为假，所以b并没有赋值100，所以：b=undefined；
* 第9行，由于局部并没有变量c，于是就找全局变量c，这时候恰恰是上方赋值的c=456，所以这时候：c=456;
* 函数体内执行完毕，第4行，给外层函数的局部变量a赋值为10
* 第5行，a=10;
* 第6行，由于在函数体内赋值了一个全局变量c=456，函数执行完并没有销毁，所以这里：c=456；

### 最终结果

![](https://i.imgur.com/jtpKcXH.png)

## 彩蛋

通过以上讲解，中间穿插了一些基础知识，这里跟大家简要总结分享下。

### 函数的定义

函数的定义有三种形式：

* 函数申明

  ```js
  function fun1(){};
  ```

* 函数表达式

  ```js
  var fun2 = function(){};
  ```

* 构造函数Function

  ```js
  var fun3 = new Function("a", "b", "return a * b");
  ```

### 变量提升（Hoisting）

就是将函数体内的 `局部变量` 和 `函数申明` 放到函数的最前面定义。

### 连等表达式

请移步： [JS解惑-连等表达式](https://github.com/sunmaobin/sunmaobin.github.io/issues/39)

### 什么是形参、实参

```js
function fun4(var1,var2){//函数结构体括号内的变量，就叫做形参。
    //TODO
};
fun4('abc',123);//调用函数时，实际传的值就叫做实参。
```

### GO和VO对象是什么

* VO，Variable Object，变量对象。这是一个伪对象，是用在函数体内，在函数 `准备` 阶段时，用来存放准备的数据的，这些数据包括3类：形参、变量和函数声明。
  * VO对象，不能直接在函数中访问，因为其实它只是一种说法而已，用来表示数据的存储行为的。
  * 所以，上文中就没提这个概念，你要用的时候，直接就访问函数的变量了，跟这个对象没啥关系，大家也可以不用太关心，只需要了解即可。
* GO，Global Object，全局对象。这个概念是跟VO有点对立，就是全局存在的一个对象，这个对象一般指的是 `window` 对象。

## 参考

* [浅谈js中的变量名和函数名重名](http://www.jb51.net/article/105345.htm)
* [JavaScript 函数定义](http://www.runoob.com/js/js-function-definition.html)

（全文完）