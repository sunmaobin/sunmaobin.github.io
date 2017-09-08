# JS解惑-Gulp中Babel用法

ES6转ES5的语法，我们使用到了Babel，但是关于Babel的包一大堆，你能分清吗？

## 基本用法

* gulp-babel
* babel-preset-es2015

安装上面的2个基本的Babel组件：

```
npm install --save-dev gulp-babel babel-preset-es2015
```

然后在与 `package.json` 同级的目录中新建文件： `.babelrc`，内容如下：

```
{
  "presets": ["es2015"]
}
```

最后在 `gulpfile.js` 中，按照如下方法使用即可：

```
var gulp = require('gulp'),
	babel = require('gulp-babel')；

gulp.src('src/**/*.js')
	.pipe(babel())
	.pipe(gulp.dest('build'));
```

## Babel插件

以上基本用法只适用于一些基本的Es6的语法，但是不全，具体有哪些稍后我再研究下放出来，但是至少如：箭头函数之类的是可以转换的。
但是涉及到Map、Set等语法就无法转换了，这时候我们可能还需要一些plugin来进一步转换。

* babel-plugin-transform-runtime
* gulp-browserify

继续安装上面的2个Babel插件：

```
npm install --save-dev babel-plugin-transform-runtime gulp-browserify
```

然后更新 `.babelrc` 内容如下：

```
{
  "presets": ["es2015"],
  "plugins": ["transform-runtime"]
}
```

最后在 `gulpfile.js` 中，按照如下方法使用即可：

```
var gulp = require('gulp'),
	babel = require('gulp-babel'),
	browserify = require('gulp-browserify')；

gulp.src('src/**/*.js')
	.pipe(babel())
	.pipe(browserify())
	.pipe(gulp.dest('build'));
```

这样，基本的一些Es6语法，基本都能够转换为Es5了。

**特别说明：**

> `babel-plugin-transform-runtime`：是Babel的插件，使得更多的Es6语法得到转换支持；
> `gulp-browserify`：是将 `babel-plugin-transform-runtime` 转换后的Nodejs的 `CommonJs` 语法转换为浏览器支持的语法，大体就是在js最顶部加入了 `UMD` 的书写方式。

> 什么是 `UMD` ？ [传送门](https://webpack.toobug.net/zh-cn/chapter2/umd.html)

LAST EDIT DATE ： 2017年9月8日17:52:36

（未完待补充）
