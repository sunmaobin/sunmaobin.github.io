---

title: NODEJS解惑-exports/module.exports/export/export default
date: 20170525120212
categories: [WEB]
tags: [JS,NODEJS]

---

初学者可能对NodeJs中的Module的导出傻傻分不清楚，我们来进行解惑。

# exports/module.exports

这组概念是 `CommonJs` 的标准。

最终模块生效的是 `module.exports` ，而 `exports` 只是 `module.exports` 的一个默认简写引用而已。

它们的关系是：`module.exports` = `exports` => [内存堆栈]。

上面的表达式隐含了以下含义：

* 默认情况下，`module.exports` = `exports`，二者指向同样的内存指向；
* 如果修改了 `exports`，那么 `module.exports` 也将同样得到修改；
* 但是修改了 `module.exports`（指向新的内存堆栈），`exports` 并不会得到修改，还是旧的内容，这时候二者将不相同。

举些栗子：

1. 可以用 `exports` 简写，最终的结果就相当于 `module.exports` 的结果。

```js
//A.js
exports.name = 'zhangsan';
exports.getId = function(){
	return 1;
};

//B.js
let a = require('A.js');
console.log(a.name);//zhangsan

```

2. 文件中既有 `exports` 也有 `module.exports`，那么最终以 `module.exports` 结果为主。

```js
//A.js
exports.name = 'zhangsan';
module.exports.getId = function(){
	return 1;
};

//B.js
let a = require('A.js');
console.log(a.name);//error

```

因为在 `A.js` 中，`module.exports` 不等于 `exports`，二者已指向不同的内容。

# export/export default

这组概念是 `ES6` 的语法。

作用同 `CommonJs` 的规范一样，都是模块化导出模块的作用。

二者的关系是： `export default` 是 `export` 的一种特例。

1. 相同点：二者都可以导出基本数据类型、对象、类等等。
1. 不同点：
   * 在一个js文件或者类中，`export` 可以使用多次（导出多个元素），但是 `export default` 只能有一个。
   * 是引用这个js对象时，如果没有 `export default`，则必须这么写： `import {xx,yy} from 'zzz.js'`；如果有，则可以这么写：`import zzz from 'zzz.js'`。

其实，最主要的作用就相当于是给导出的模块有个默认的值一样。

# 补充一点

其实在Node.js中，这2组概念是可以混合着用的，但是为了保证概念的统一性，建议还是结对使用。

建议：

* 使用ES6的语法，就用 `export + import`
* 使用默认语法，就用 `exports + require`

（全文完）
