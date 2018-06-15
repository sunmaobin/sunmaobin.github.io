# CSS解惑 - word-wrap 和 word-break 的区别

## 背景

最近在做PC端项目的时候，遇到一个bug，表现出来的症状如下：

<img src="https://i.imgur.com/t77K8dM.png" width="600px;">

html部分代码如下：

```html
<tr>
    <th width="15%">
        操作
    </th>
    <th width="50%">
        用户群名称
    </th>
    <th width="35%">
        创建时间
    </th>
</tr>
```

表现出来的症状就是Table中的文字溢出了，为什么会是这样呢？

## 原因

浏览器在解析页面上的文字的时候，默认会把一个单词、文字放到一行，如果一行展示不下，就另起一行展示，但是如果下一行在你设置的宽度内还是展示不下，就会出现上面溢出的情况。

于是CSS提供一些解决的办法，主要包括以下属性：

* overflow
* word-wrap
* word-break
* overflow-wrap

那么这些属性有什么区别？哪个才能真正解决上面的问题呢？本文就将重点介绍。

## 基础

### overflow

常用的一个属性，用来控制容器的溢出，常用的有2个属性：

* overflow=hidden，当设置容器宽或者高时，如果内容超过容器，则被隐藏不会超过容器外；
* overflow=scroll，如果内容超过容器宽高，则出现滚动条；

但是这个属性在特定情况下，对于table是无效的，看：[这里](https://stackoverflow.com/questions/509711/why-does-overflowhidden-not-work-in-a-td)

### word-wrap

文字如何包裹显示，常用的属性：

* word-wrap=break-word，当文字超过容器宽度时，自动换行显示；

### word-break

文字如何截断，常用的属性：

* word-break=break-all，如何什么情况都将文字截断显示；
* word-break=break-word，作用同 `word-wrap=break-word` ，但是这种写法在IDE中会提示没有这个属性，但是在Chrome浏览器调试却可以这么设置，所以这么写可能存在兼容性。

chrome浏览器：

<img src="https://i.imgur.com/Y81L3L7.png" width="300px">

Webstorm：

<img src="https://i.imgur.com/24VQnm3.png">

所以，我个人猜测 `word-break=break-word` 这可能是Chrome或者新的标准增加的属性（网上对于这种写法资料非常少），最好不要这么写，兼容性无法保证。

> PS：但是这个写法我底下还会提到一次，因为这种写法在table中是管用的！！！

### overflow-wrap

溢出包裹显示，CSS3中将 `word-wrap` 改名为 `overflow-wrap` 。使用方法同上，但是如果你有浏览器兼容性的可能，最好还是老老实实用 `word-wrap` 。

## 区别

### 概念对比

通过上面的概念，最难区分的就是 `word-wrap` 和 `word-break` 这2个概念，到底如何使用，下面就给大家做个比较：

* word-wrap=break-word，如果超过容器宽度，则换行显示，如果浏览器会尽量将相同的单词放到一起；
* word-break=break-all，暴力换行，将整个容器的内容看成一个字符串，超过容器宽度，就换行；

下面举个栗子说明：

```css
.div{
    width : 120px;
    border:1px solid red;
}
```

```html
<div class="div">
  我我我我我我我我我我我我我我我我我我我我我我我，
。。。。。。。。。。。。。。。。。。。。。，
aaadsasffsdafasfsadfsfsafsadfsdafsdfsadf，
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@,
233323333333333333333333333333333333333，
！！！！！！！！！！！！！！！！！！！！！！！！！！！
</div>
```

* 不做任何控制，表现的结果如下：

<img src="https://i.imgur.com/MT0Yfl8.png" width="500px">

* 现在增加 `word-wrap:break-word` ，得到如下结果：

```css
.div{
    width : 200px;
    border:1px solid red;
    word-wrap:break-word;
}
```

<img src="https://i.imgur.com/Hnph1pJ.png" width="200px">

**注意：**在每个逗号后面这一行都为空了，没有把文字紧跟着就显示。

* 现在我们换成 `word-break:break-all`，看看效果：

```css
.div{
    width : 200px;
    border:1px solid red;
    word-break:break-all;
}
```

<img src="https://i.imgur.com/A60kkTS.png" width="400px">

结论：

1. 相比较没有任何溢出控制，这里还是起到了一定作用，但是 `中文符号` 没有得到控制，有缺陷；
2. `@,` 和后面的 `233...` 数字紧挨到一行显示了，并不像 `word-wrap:break-word` 每个词都一起显示，不打断；

* 两种控制语句都增加，是什么效果？

```css
.div{
    width : 200px;
    border:1px solid red;
    word-wrap:break-word;
    word-break:break-all;
}
```

<img src="https://i.imgur.com/A60kkTS.png" width="400px">

结论：

当 `word-wrap` 和 `word-break` 同时书写时，生效的是 `word-break`。（PS：这里调换CSS中这2行的顺序，结果不变）

### 结论

* 要控制内容溢出，推荐使用：`word-wrap:break-word`；
* `word-break:break-all` 对于中文符号无法截断；

## Table中溢出问题

说了半天好像问题解决，当我们在table中增加 `word-wrap:break-word `属性时，结果会是咋样呢？

```css
table.one{
   word-wrap:break-word; 
}
```

```html
<table class="one" border="1" width="100%">
<tr>
	<td width="20%">1000000000000000000000000000</td>
	<td width="40%">10000000，
        我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我我，
        ！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
    </td>
	<td width="40%">
        http://aaaaaaaaaaaaaaabbbbbbbbbbbbbbbbbbbbbccccccccccccccccccccccccc.com
    </td>
</tr>
</table>
```

却得到了如下效果：

<img src="https://i.imgur.com/rdJig1R.png" width="600px">

与期待的结果相比，整个Table被撑破了，超过了100%的宽度，并且已经超过了外边的容器了。那么，为什么换行没有生效呢？

### 原因

主要原因是table默认的布局方式就是会动态调整Table的列宽，即便你设置了`th/td width`，但是内容优先，一旦内容过长还是会撑宽整个Table，除非你设置table的布局是绝对布局！

设置方法就是：`table-layout:fixed`，这种情况下table的宽度，设置100%，就不会再变宽！

同时，设置 `table-layout:fixed` 还有个作用，就是当你的Table要带滚动条的时候，也可以使用，代码如下：

```css
.table-wrapper{
    overflow: auto;
    width:300px;
}
.table{
    table-layout: fixed;
}
```

```html
<div class="table-wrapper">
    <table>
        <thead>
        	<tr>
            	<th width="100px">列1</th>
                <th width="300px">列2</th>
            </tr>
        </thead>
    </table>
</div>
```

好了，言归正传，当我们明白这个道理以后，本文最开始提到的问题就可以解决了。解决办法就是：

```css
table.one{
	table-layout: fixed;
	word-wrap:break-word; 
}
```

得到效果如下：

<img src="https://i.imgur.com/S4svgsy.png" width="600px">

于是这个问题算是解决了。

但是，这里还有个小细节，在table中，浏览器默认有个属性设置：

```css
table{
    white-space: normal;
}
```

`white-space` 有什么用？就是代表单词之间是否有空白区域，其主要的值有2个：

* `white-space=normal` 表示正常间隔
* `white-space=nowrap` 表示单词之间无间隔

所以，如果你的table中有设置 `white-space=nowrap` 那么上面的也会有问题！所以为了保险，还是请手动增加 `white-space=normal` 以防止不被别的table样式覆盖。

### 最终方案

```css
table{
    white-space: normal;
    table-layout: fixed;
	word-wrap:break-word; 
}
```

### 疑惑

还记得上文中提到的 `word-break=break-word` 这个诡异的配置么？如果使用这个配置，那么不配置 `table-layout=fiexd` 也可以！

```css
table.one{
	word-break:break-word; 
}
```

效果居然也正常：

<img src="https://i.imgur.com/S4svgsy.png" width="600px">

所以，如果你说 `word-break=break-word` 和 `word-wrap=break-word` 效果一样？在div中一样，但是在table中居然不一样。至今我也没太搞清楚，如果有人知道请告诉我，谢谢。

## 参考

* [Why does overflow:hidden not work in a \<td\>?](https://stackoverflow.com/questions/509711/why-does-overflowhidden-not-work-in-a-td)
* [Word-wrap in an HTML table](https://stackoverflow.com/questions/1258416/word-wrap-in-an-html-table)