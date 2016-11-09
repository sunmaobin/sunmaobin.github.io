---

title: JS解惑-jQuery.clone
date: 20161107104059
categories: [WEB]
tags: [js]

---

关于jQuery中clone的一些解惑。

## 用途

假如你想把一个html元素copy一份到另一个元素中，就可以使用 `.clone` 了。

比如：

```html
<div class="container">
  <div class="hello">Hello</div>
  <div class="goodbye">Goodbye</div>
</div>
```
如果你想把 `.hello` 放到 `.goodbye` 中，那么以下写法就是不对的。

```js
$( ".hello" ).appendTo( ".goodbye" );
```
这样的结果将是：

```html
<div class="container">
  <div class="goodbye">
    Goodbye
    <div class="hello">Hello</div>
  </div>
</div>
```
但是，如果你使用 `clone()` ，那么结果将是你预期的。

```js
$( ".hello" ).clone().appendTo( ".goodbye" );
```

```html
<div class="container">
  <div class="hello">Hello</div>
  <div class="goodbye">
    Goodbye
    <div class="hello">Hello</div>
  </div>
</div>
```

**注意：**jquery中的clone，只针对的是 `html` 原型而言的！如果你将一个js对象clone()，就会报错了。

```js
jquery.min.js:2 Uncaught TypeError: Cannot read property 'ownerDocument' of undefined(…)
```

## API

`$.clone（）` 可以传递2个参数：

* withDataAndEvents，默认：false
* deepWithDataAndEvents，默认：等于withDataAndEvents（**特别注意这里**）

> 这里就不区分jQuery的版本了，假设我们都 > 1.5。如果还有低版本的，可以看看 [官网](https://api.jquery.com/clone/) 的兼容性说明。

## 分析

1. `$.clone()`：仅仅克隆当前元素的html结构以及**当前元素及其子元素html上绑定的事件和数据**（下文解释）；
	* `数据`是指通过 `data-*` 属性赋值的属性。
1. `$.clone(true,false)`：克隆当前元素html结构、当前元素及其子元素html上绑定的事件和数据，但是不包括子元素上动态绑定的事件和数据；
1. `$.clone(true)`：克隆当前元素html结构、当前元素及其子元素html上绑定的事件和数据，以及子元素的事件和数据。
	* 等同于 `$.clone(true,true)`，因为通过API我们知道，第2个参数默认等于第1个参数。

## 示例

```html
<p class="wrapper">
    <input class="test" type="text" oninput="inputEvt(this)"/>
</p>

<script src="http://code.jquery.com/jquery-1.6.1.js"></script>

```

```js
function inputEvt(obj){
    console.log($(obj).val())
};

$('.wrapper').click(function () {
    console.log('click');
});

$('.test').data('obj','test');

//clone1
$('.wrapper').clone(false).prependTo($("body"));

//clone2
$('.wrapper').clone(true,false).prependTo($("body"));

//clone3
$('.wrapper').clone(true).prependTo($("body"));

```

结果说明：

1. clone1
	* .wrapper，click *无输出（`click`）；
	* .test，输入文字立即有输出（`oninput`）
	* .test，data=undefined（`data`）
1. clone2
	* .wrapper，click有输出（`click`）；
	* .test，输入文字立即有输出（`oninput`）
	* .test，data=undefined（`data`）
1. clone3
	* .wrapper，click有输出（`click`）；
	* .test，输入文字立即有输出（`oninput`）
	* .test，data=test（`data`）

## 总结

`clone（）`方法其实包含了3部分内容：

* html结果以及一开始绑定写在html上的事件和数据
* `+` 动态绑定到html上的事件和数据（直接绑定，live/delegate/on等委托绑定除外）
* `+` 子元素及其事件和数据

而以上3部分内容，分别对应以下用法：

* clone()
* clone(true,false)
* clone(true) 或 clone(true,true)

## 特例

处于性能的考虑 `textarea` 和 `select` 这2个标签动态增加的属性有点例外。

* `textara` 克隆后，值不会带过去；
* `select` 选中的 `option` 克隆后，依然是未选择状态；

## 副作用

如果你把一个含有ID的元素进行克隆，那么克隆以后就会出现ID重复！

为了避免这问题，建议你这么做：

* 克隆的元素尽量使用 `class` 而非 `id`;
* 克隆以后修改新元素的 `id`；


（全文完）

## 参考

1. [jQuery官网API](https://api.jquery.com/clone/)

