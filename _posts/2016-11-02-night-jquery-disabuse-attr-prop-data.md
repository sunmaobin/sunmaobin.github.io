---

title: jQuery解惑-attr()、prop()、data()
date: 20161102084059
categories: [WEB]
tags: [js]

---

jQuery中提供了3个方法，`.attr()`、`.prop()` 和 `.data()`，本文就介绍下这3者之间的不同。

## .attr 和 .prop

关于这组概念在 `jquery-1.6.1` 的升级日志里说的太清楚不过了，看：[这里](http://blog.jquery.com/2011/05/10/jquery-1-6-1-rc-1-released/)，这里我大体总结下。

其实有一句话非常关键，大家只要理解了它，就自然明白了：

![](http://i.imgur.com/OTv9LCy.png)

### `property` 是元素的固有特性，体现了它相关的 `attribute`（如果存在的话）

比如：对于 `checkbox` 而言 `checked` 是其固有特性。怎么理解这句话呢？

看看示例：

```html
<input type="checkbox" id="checkbox">
```

* 这里没有checked这个属性（attribute），即：$('#checkbox').attr('checked') 的值是 undefined
* 但是我可以通过js，获取其是否选中的特性，即：$('#checkbox').prop('checked') 的值是 false
* 原生js的写法是：document.getElementById('checkbox').checked //结果是：false

看看效果：

![](http://i.imgur.com/zm0IcSS.gif)

那么，为什么在1.6.1开始就区分了 `attr` 和 `prop` 这2个概念了呢？

以下阐述可能就是原因：

对于 `document` 和 `window` 这2个js对象，他们是没有 `attributes` 的（可以看到的属性），因为这是2个隐藏于页面内部的2个对象。
但是，`window`却拥有类似于 `loation`、`screen`等 `properties`。明白了吧？

也就是说，直到1.6.1开始，人们才认清了属性和特性之间的区别，应该区分来处理。

看看示例：

![](http://i.imgur.com/L3TNk1S.png)

### 什么时候用 `prop` ，什么时候用 `attr` 

>The .prop() method should be used for boolean attributes/properties and for properties which do not exist in html (such as window.location). All other attributes (ones you can see in the html) can and should continue to be manipulated with the .attr() method.

`.prop()` 是用在具有 `Boolean` 类型属性/特性上，而且对于特性而言它们并不在html上存在（比如：window.location），其它你能在页面上看到的所有的属性，都可以使用 `.attr()`。

**说明：**在 `jquery-1.6.1`之后，你也可以使用 `.attr()` 来获取 `document/window`的一些特性，但是对于类似于 `checked` 之类的，如果页面上没有这个属性，你获取到的结果是 `undefined`，并不能很好的反应其是否被选中！所以，该用 `.prop()` 的时候还是要用。

## .attr 和 .data

从 `jquery-1.4.3` 开始支持 `.data()` 来获取元素上绑定的数据。

为什么jQuery要增加这个方法？因为HTML5新增了一种属性结果：`data-*`

### HTML5增加 `data-*` 属性的背景

比如，我们在Bootstrap中就可以随处看到这种直接在html上增加数据绑定，比如：[popover](http://getbootstrap.com/javascript/#popovers)

```html
<button type="button" class="btn btn-default" data-container="body" data-toggle="popover" data-placement="top" data-content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus.">
    Popover on top
</button>
```
那么，HTML5为什么要增加这种属性呢？

> Before HTML5, working with arbitrary data sucked. To keep things valid, you had to stuff things into rel or class attributes. Some developers even created their own custom attributes. Boy, was it a mess.

> But that all changed with the introduction of HTML5 custom data attributes. Now you can store arbitrary data in an easy, standards-compliant way.

在HTML5之前，开发者为了临时保存一些与标签有关的数据时，往往把数据临时保存到 `rel`、`class` 这些标签上，甚至有些人就自己造一些标签来保存，简直混乱不堪。

所有HTML5就增加了 `data-*` 的标签，以专门用来缓存标签数据。

### `.data()` 有哪些特别之处

#### 1、获取数据时不需要加前缀 `data-`

栗子：

```html
<a id="foo"
    href="#"
    data-str="bar">foo!</a>
```

```js
$('#foo').data('str');  //"bar"
```

而通过 `.attr()` 获取的话，需要携带上。

```js
$('#foo').attr('data-str');  //"bar"
```

#### 2、获取的数据会被自动转换格式

栗子：

```html
<a id="foo"
    href="#"
    data-str="bar"
    data-bool="true"
    data-num="15"
    data-json='{"fizz":["buzz"]}'>foo!</a>
```

```js
$('#foo').data('str');  //string "bar"
$('#foo').data('bool'); //boolean true
$('#foo').data('num');  //numuber 15
$('#foo').data('json'); //object  {fizz:['buzz']}
```
而通过 `.attr()` 获取的数据，全部是 `string` 类型。

#### 3、获取数据时可以使用 `驼峰式` 取值

`data-*` 的格式规定：`data-`之后所有单词之间用中划线 `-`，这样再取值的时候，js可以直接用驼峰取值。

栗子：

```html
	<input type="checkbox" id="checkbox" data-name-width="1080" data-name_height="1920">
```

```js
	console.log($("#checkbox").attr('data-name-width'));//string "1080"
    console.log($("#checkbox").data('name-width'));//integer 1080
    console.log($("#checkbox").data('nameWidth'));//integer 1080

    console.log($("#checkbox").attr('data-name_height'));//string "1920"
    console.log($("#checkbox").data('name_height'));//integer 1920
    console.log($("#checkbox").data('nameHeight'));//undefined
```

**说明：** 

* `data-`之后当然也可以使用下划线 `_`，但是就不支持驼峰取值了;
* 使用驼峰式，还可以这么取值：`$("#checkbox").data()['nameHeight']`，但是 `$("#checkbox").data()['name-height']` 就获取不到值，可能的原因是：js中不推荐使用中划线。

#### 4、与 `.prop()` 有几分相似

我们通过上文知道 `prop` 是元素固有特性，体现了 `attr` （如果存在的话）。意思就是，`prop` 可以不在 html 标签上出现，但其实它是存在的。

`data` 也是一样的！如果你体现到标签上，那么就可以通过 `.attr()` 获取，但是没有体现出来，就获取不到，只能通过 `.data()` 获取。

栗子：

通过js动态给元素增加data，这时候就只能通过 `.data()` 获取到，而通过 `.attr()` 是获取不到的。

```js
//动态增加data
$("#checkbox").data('name-width2',222);

//获取值
$("#checkbox").data('name-width2');//222
$("#checkbox").attr('data-name-width2');//undefined
```

反过来：

通过 `.attr()` 修改了标签上data的值，通过 `.data()` 获取的值其实没变。

```js
//修改值
$("#checkbox").attr('data-name-width',2000);

//获取值
$("#checkbox").attr('data-name-width');//"2000"
$("#checkbox").data('name-width');//1080，注意：这里是没有改变的。
```

所以，大家在使用 `.attr()` 和 `.data()` 时，一定不要混合使用，不然可能就会出错，也就是赋值和取值用同一种标签，就肯定没错。

### 其它说明

其实在HTML5中已经有API提供了类似于jquery的方法，就是 `dataset`。

栗子：

```js
// Here's our button
var button = document.getElementById('your-button-id');

// Get the values
var cmd = button.dataset.cmd;
var id = button.dataset.id;

// Change the values
button.dataset.cmd = yourNewCmd;
button.dataset.id = yourNewId;
```

（全文完）

## 参考

1. [.prop() vs .attr()](http://stackoverflow.com/questions/5874652/prop-vs-attr)
1. [jQuery 1.6.1 RC 1 Released - What’s Changed](http://blog.jquery.com/2011/05/10/jquery-1-6-1-rc-1-released/)
1. [jQuery Data vs Attr?](http://stackoverflow.com/questions/7261619/jquery-data-vs-attr)
1. [Working with HTML5 data attributes](https://www.abeautifulsite.net/working-with-html5-data-attributes)


