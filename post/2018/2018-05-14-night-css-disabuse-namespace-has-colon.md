# CSS解惑-CSS选择器中含有冒号该怎么写

## 背景

最近在使用组件的时候，自定义了一个组件，在html中写法如下：

```html
<comp:table>
	...
</comp:table>
```

于是突然就想到，这样的html标签，在css中该如何写呢？比如下面的写法肯定会报错：

```css
<!-- 错误的写法 -->
comp:table{
    color: red;
}
```

那么如果对于这种自定义html标签，对于css来说就是selector中有特殊字符了，该怎么处理呢？

## 解惑

对于CSS中含有冒号的写法，在CSS专业属于中，叫：`Namespace` 即命名空间，参考：[Using Namespaces with CSS](https://msdn.microsoft.com/en-us/library/ms762307(VS.85).aspx)。

上面的MSDN文章中给出的解决方案就是加反斜杠即可：

```css
<!-- 不兼容IE8的写法 -->
comp\:table{
    color: red;
}
```

但是参考了stackoverflow中的评论，这种写法在IE8以及以下有兼容性问题，所以，最好的办法是将 `\:`转义为 `\3A`，因为转义后的语法是CSS2的标准，参考：[Using Namespaces with CSS](https://msdn.microsoft.com/en-us/library/ms762307(VS.85).aspx)。

于是，最终得到正确的答案就是：

```css
<!-- 完美的写法 -->
comp\3Atable{
    color: red;
}
```

## 延伸

当然，对于除了冒号，可能还存在各种特殊符号的情况下，css中该怎么写呢？有人就给出了一个在线的转换网站，大家可以看看：[CSS escapes](https://mothereff.in/css-escapes#0search_form%3Aexpression)。

## 参考

* [Handling a colon in an element ID in a CSS selector](https://stackoverflow.com/questions/122238/handling-a-colon-in-an-element-id-in-a-css-selector)
* [Using Namespaces with CSS](https://msdn.microsoft.com/en-us/library/ms762307(VS.85).aspx)
* [Characters and case](https://www.w3.org/TR/CSS2/syndata.html#characters)
* [CSS escapes](https://mothereff.in/css-escapes#0search_form%3Aexpression)