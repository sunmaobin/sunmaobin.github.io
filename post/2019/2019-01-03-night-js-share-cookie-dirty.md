# 经验分享-史上最奇葩的cookie问题

最近看到一篇文章，关于一个cookie的问题，今天跟大家简单分享下。

文章来源：[我遇過的最難的 Cookie 問題 ](https://github.com/aszx87410/blog/issues/17)

## 问题描述

1. 假如在 `a.xxx.com` 域名下写了一个 cookie，设置 `secret=true;domain=a.xxx.com`（**注意：** 一定要设置 `secret=true`）
2. 那么在 `b.xxx.com` 域名下写 `相同`名字的 cookie给 `domain=.xxx.com` 下是写不进去的！！！(**注意：** 是另一个二级域名给主域名下写)

## 诡异之处

由于你是在 `b.xxx.com` 这个域名下写cookie，所以你根本看不到 `a.xxx.com`下写的自身域下的 cookie！所以，当你打开控制台调试，或者抓包都看不到cookie信息，但是，你就是写不进去。

于是，你就会怀疑是不是自己的写法有问题！进而怀疑人生！

## 解决办法

1. 换个 cookie 名字；
2. 将 cookie 写在 `b.xxx.com` 自己的域下面；



问题详细分析和来源，请参考：[我遇過的最難的 Cookie 問題 ](https://github.com/aszx87410/blog/issues/17)