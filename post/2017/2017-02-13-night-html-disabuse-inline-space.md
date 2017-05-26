# HTML解惑-行内元素之间有空隙

有没有发现，行内元素之间有一些空隙？

## 一、行内元素之间的空隙

先举个栗子

```html
<div>
	<a href="#">1</a>
	<a href="#">2</a>
	<a href="#">3</a>
</div>
```

展示出来的结果，你发现1、2、3之间并未严格贴在一起，而是之间有一些间隙？

这就是行内元素之间默认的间隙！

本文简单的讲下出现这种问题的常见的场景！

## 二、行内元素的形成

### 2.1 默认的行内元素存在间隙

如：`a`、`span`、`img`等

### 2.2 强制将元素属性设置为 `inline` 或者 `inline-block`的

```css
div{
	display : inline;/* inline-block */
}
```

## 三、空隙带来的负作用

1. 无法准确控制元素之间的间隙；
1. 4个25%的inline-block元素，会出现换行（即所有元素间隙之和大于100%）；
1. 如果是图片的话，100%宽度显示图片时，父容器的底部会有间隙，除非把图片设置为：block；

## 四、常见的解决办法

参考：[https://css-tricks.com/fighting-the-space-between-inline-block-elements/](https://css-tricks.com/fighting-the-space-between-inline-block-elements/)

