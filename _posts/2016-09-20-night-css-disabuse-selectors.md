---

title: CSS解惑-selectors
date: 20160920013407
categories: [WEB]
tags: [css]

---

css中有诸多选择器，运用得当的情况下，能让你少些不少的js，同时从容应对浏览器兼容的烦恼。

## 手册

大家先看看 `阮一峰` 老师，在2009年总结的css选择器的文章：[css选择器笔记](http://www.ruanyifeng.com/blog/2009/03/css_selectors.html)

## 解惑

### 一、CSS通用选择器及其优先级

我们知道 `基本选择器` 包括：`通用选择器`、`元素选择器`、`类选择器` 和 `ID选择器`。

这些这是概念，告诉你css有这些选择器，但是你知道他们在实际生产中如何使用，且有哪些规则吗？

#### 1.1 基本用法

1. 通用选择器

```css
//对所有元素都生效
*{
	padding:0;
	margin:0;
	box-sizing:border-box;
}
```

1. 元素选择器

```css
//仅对p元素生效
p{
	margin: 5px 0;
}
```

1. 类选择器

```css
//仅对某一类元素生效
//这个与【元素选择器】有点类似，只是【类选择器】中的【类class】是自己定义的，而【元素选择器】中的【元素element】是html自带的。
.demo{
	color : blue;
}
```

1. ID选择器

```css
//仅对某一个元素生效
#demo1{
	color : red;
}
```

#### 1.2 组合套路

在面试的时候，面试官可能会问你选择器的优先级？为什么选择器还有优先级呢？因为css也是被顺序执行的，同时对某一个元素而言，它身上可能有多个选择器同时作用，那么自然而然就需要有个优先级来处理，这样我们最终看到的效果，就是这些共同作用的结果。

比如：

```css
p{
   color : red;
}

#p1{
   color : blue;
}

.demo #p1{
   color : green;
}
```

看看以上的例子，你知道最终 `#p1` 这个元素会显示什么颜色吗？这里就涉及到选择器的组合使用和优先级的问题了。

**单优先级**

`!important` > `ID选择器` > `类选择器` > `元素选择器` > `通用选择器`

**组合优先级**

* `!important` 权重：1000
* `ID选择器` 权重：100
* `类选择器` 权重：10
* `元素选择器` 权重：1
* `通用选择器` 权重：0（就是最后被执行的，相当于没权重）

如何通过权重来知道最终生效的样式呢？看看上面的示例。

* `p` 元素选择器，结果是：1
* `#p1` ID选择器，结果是：100
* `.demo #p1` 类选择器 + ID选择器，结果是：10 + 100 = 110

所以，最终的结果是：green

### 二、组合选择器及其特殊技巧

#### 2.1 两个易混淆的概念

* `E F`，后台选择器
* `E > F`，儿子选择器

这2个区别就在于，作用的程度不一样，你说儿子是不是后台呢？当然是，举个例子就明白了。

```html
<ul class='list1'>
	<li>a1</li>
	<li>
		<ul class='list2'>
			<li>b1</li>
		</ul>
	</li>
</ul>
```

以上代码，如果使用儿子选择器，则list2中的li不会生效。

```css
.list > li{
	color : red;
}
```

但是，如果使用后台选择器，则代码中所有li生效，因为list2中的li相当于孙子，依然是后代嘛！

```css
.list li{
	color : red;
}
```

#### 2.2 相邻选择器的妙用

有这样一个需求，下来菜单中，每个菜单之间有一条横线。怎么实现呢？

```html
<ul class='nav'>
	<li>menu1</li>
	<li>menu2</li>
	<li>menu3</li>
</ul>
```

你可能这么写：

```css
.nav li{
	border-bottom : 1px solid #ccc;
}
```

这个问题在哪里呢？就是最后一个li底部也有一条线，这个是我们不想看到的。那你可能会用 `border-top`，那不一样么？第一个顶部也会有一条线。

好了，聪明一点的你，可能会用伪类：

```css
.nav li{
	border-bottom : 1px solid #ccc;
}

.nav li:last-child{
	border-bottom:none;
}
```

问题在chrome上解决了，但是到IE8以下的浏览器一看，没生效！肿么办？继续优化呗！

```css
.nav li{
	border-bottom : 1px solid #ccc;
}

.nav .last{
	border-bottom:none;
}
```

然后在最后一个li上增加一个class：

```html
<ul class='nav'>
	<li>menu1</li>
	<li>menu2</li>
	<li class='last'>menu3</li>
</ul>
```

好的，问题总算解决了，但是如果需求说还要在最后增加一个菜单，于是乎，又得增加一行li，同时把之前的class，挪到最后一个上写。

写了这么多，你知道我想表达什么意思么？这里就是 `相邻选择器` 的妙用的地方，以下这个写法，相当漂亮：

```css
//与li相邻的li
.nav li+li{
	border-top : 1px solid #ccc;
}
```

以上代码就是除了第1个li元素外，其余li都顶部有border。因为相当于第1个li，第2个是它相邻的；相对于第2个li，第3个是它相邻的。

当然这种写法的含义就是：`除第1个外其余的`。

