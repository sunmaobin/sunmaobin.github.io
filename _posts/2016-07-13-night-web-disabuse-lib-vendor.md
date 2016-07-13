---

title: JS解惑-语法糖
date: 2016071390542
categories: [WEB]
tags: [web]

---

web前端目录中的 `lib` 和 `vendor` 到底有啥区别？

## 讨论

先来看看定义：

* lib，即libraries
* vendor，即third-party libraries

从这个层面上来看，vendor应该是lib的一个子集。

于是，第一种目录关系出现了，即：

```
|- lib
   |- plugin
   |- util
   |- ...
   |- vendor
	  |- jquery/
	  |- boostrap/ 
```

以上目录结构也没有错，但是总感觉有些不妥，哪里不妥呢？

就是自己项目的函数库和第三方的混到一起，使得有以下问题：

* 动静部分，即经常修改的和经常不修改的混合；
* vendor，有可能使用cdn，到时候剥离起来，还得从lib/目录下删掉，影响整个结构

鉴于以上分析，有人提出了这样的概念：

* lib，application libraries，也就是自己应用内的函数库
* vendor，即third-party libraries，也就是第三方库

于是，第二种目录关系出现了，即：

```
|- lib
   |- plugin
   |- util
   |- ...
|- vendor
   |- jquery/
   |- boostrap/ 
```

这种目录结构是，lib 和 vendor 是同级的。

## 结论

经过仔细分析和实际项目使用，个人觉得第二种方案更适合项目规范和开发流程，我们目前就采用第二种方案。

## 参考

* [What is the difference between the “lib” and “vendor” folders?](http://programmers.stackexchange.com/questions/123305/what-is-the-difference-between-the-lib-and-vendor-folders)
* [Project directory structure](http://programmers.stackexchange.com/questions/tagged/directory-structure)
