# WEB解惑-require用法

关于 `require.js` 使用上的一些说明。

## 常规用法

* 页面仅保留一个 `require.js` 的js文件，并添加属性 `data-main` 关联入口js文件。

```html
<!DOCTYPE html>
<html>
    <head>
        <title>My Sample Project</title>
        <!-- data-main attribute tells require.js to load
             scripts/main.js after require.js loads. -->
        <script data-main="scripts/main" src="scripts/require.js"></script>
    </head>
    <body>
        <h1>My Sample Project</h1>
    </body>
</html>
```

> 上面的 `data-main` 是一个入口js文件指向，这个main文件可以写成 `scripts/main.js` 也可以省略 `.js` 后缀。

* 入口文件 `main.js` 中一般要包含 require的config设置，以及入口的一个require模块。

```
requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'js/lib',
    //except, if the module ID starts with "app",
    //load it from the js/app directory. paths
    //config is relative to the baseUrl, and
    //never includes a ".js" extension since
    //the paths config could be for a directory.
    paths: {
        app: '../app',
		jquery : 'jquery.min'
    }
});

// Start the main app logic.
requirejs(['jquery', 'canvas', 'app/sub'],
function   ($,        canvas,   sub) {
    //jQuery, canvas and the app/sub module are all
    //loaded and can be used here now.
});
```

> 注意：`requirejs.config` 的 `paths` 中一定不能带有文件后缀名，如 `.js` ，因为它有可能是一个目录！
> 如果带了，require请求的文件结果，可能会是这样 `http://.../js/jquery.min.js.js`

详见 [http://requirejs.org/docs/api.html#config-paths](http://requirejs.org/docs/api.html#config-paths)

> The path that is used for a module name should not include an extension, since the path mapping could be for a directory. The path mapping code will automatically add the .js extension when mapping the module name to a path. If require.toUrl() is used, it will add the appropriate extension, if it is for something like a text template.


## 多页面

以上常规用法，一般适合 `SPA` 即单页面应用，由一个主页面作为入口，全程AJAX无刷操作。但是，如果有多个页面跳转，而每个页面都想使用require，并且使用全局一个配置，怎么办呢？

思路：

* 引入 `require.js` 的时候不指定 `data-main` 入口函数；
* 将 `require.config` 单独到一个文件中，在页面上加载完 `require.js` 后，接下来使用 `require` 命令先加载 `require.config`；
* 配置加载完成后，再初始化不同页面需要的不同配置入口模块。

示例：

* `config.js` 仅仅包含 `config` 全局配置

```js
requirejs.config({
    baseUrl: 'js',
    paths: {
		jquery : '../lib/jquery.min'
    }
});
```

* `main1.js` 作为页面1的入口函数

```js
requirejs(['jquery'],
function ($) {
    console.log('main1');
});
```

* `main2.js` 作为页面2的入口函数

```js
requirejs(['jquery'],
function ($) {
    console.log('main2');
});
```

* `page1.html`

假设 `config.js`、`main1.js` 和 `main2.js` 都在 `js` 目录下。

```html
<!DOCTYPE html>
<html>
    <head>
        <title>Page1</title>
    </head>
    <body>
        <h1>Page1</h1>

		<script src="scripts/require.js"></script>   <!-- 这里先加载requirejs的文件 -->
		<script>
			requirejs(['js/config'],function(){      <!-- 再加载requirejs的配置文件，其中：baseUrl:'js' 目录 -->
				requirejs(['main1'],function(){      <!-- 配置文件加载完成后，初始化main1模块 -->
					//TODO  
				})
			})
		</script>
    </body>
</html>
```

* `page2.html`

```html
<!DOCTYPE html>
<html>
    <head>
        <title>Page2</title>
    </head>
    <body>
        <h1>Page2</h1>

		<script src="scripts/require.js"></script>   <!-- 这里先加载requirejs的文件 -->
		<script>
			requirejs(['js/config'],function(){      <!-- 再加载requirejs的配置文件，其中：baseUrl:'js' 目录 -->
				requirejs(['main2'],function(){      <!-- 配置文件加载完成后，初始化main2模块 -->
					//TODO  
				})
			})
		</script>
    </body>
</html>
```

## 一个文件中多个define

requirejs其实提倡的做法是一个js文件中一个define定义，也就是一个文件一个模块。

但是，有时候我们又希望多个define声明在一个文件中，主要是用在打包资源的时候，将多个文件合并到一个文件中，这时候自然就是一个文件中多个define了。

比如：


我么知道每个js文件中，我们一般这么写：

```js
//模块代码
define(['jquery'],function($){
	//TODO
});
```

合并后的文件：

```js

//build.js

//模块1的代码
define([],function(){
	//TODO
});

//模块2的代码
define([],function(){
	//TODO
});

...

```

如果你单纯这么压缩代码，压缩后使用requirejs肯定无法运行的。

后来 `require.js` 提供了一个 `r.js` 的优化打包工具和命令：[https://github.com/requirejs/r.js](https://github.com/requirejs/r.js)

使用它打包后，直接将 `requirejs` 的 `data-main` 主入口文件指向这个打包好的文件就可以了。

比如：

下面的 `build` 就是我打包好的js文件。
 
```html
<!DOCTYPE html>
<html>
    <head>
        <script data-main="scripts/build" src="scripts/require.js"></script>
    </head>
    <body>
        <h1>My Sample Project</h1>
    </body>
</html>
```

OK，到此为止，一个js中有多个define的问题也就解决了，但是新的问题又来了：

**如果是项目级别的话，难不成如果要打包非得将所有模块打包到一个js文件中？**

抱着这个疑问，继续窥探require的用法，找到了2个发现：

1. `requirejs` 貌似 `2.1.x` 以上版本提供了 `bundles`;
2. 通过 `r.js` 打包后的文件中，多个define并不是单纯的合并到一起了，而是多了个 `define name`;

* 什么是 `bundles` ？

比如：

```js
requirejs.config({
    bundles: {
        'build1': [
			'main1',
			'main2'
		],
        'build2': [
			'main3',
			'main4'
		],
    }
});
```

什么意思呢？

就是 `build1` 这个js 中，输出 `main1` 和 `main2` 这2个模块。前提是这2个模块要都在 `build1` 中define，不然也不会报错。

那么，现在看看通过 `r.js` 压缩后的 `build1.js` 中的内容：

```js

//build.js

//模块1的代码
define('main1',[],function(){
	//TODO
});

//模块2的代码
define('main2',[],function(){
	//TODO
});

```

再使用的时候，你不必关心 `main1` 或者 `main2` 到底定义在哪里，使用就好啦。

比如：

```html
<!DOCTYPE html>
<html>
    <head>
        <title>Page2</title>
    </head>
    <body>
        <h1>Page2</h1>

		<script src="scripts/require.js"></script>
		<script>
			requirejs(['js/build'],function(){
				requirejs(['main1'],function(){
					//TODO  
				})
			})
		</script>
    </body>
</html>
```

## 关于 `r.js` 的使用

按照教程使用没有一点问题，但是结合项目，总是让你凌乱。

### 问题1

比如： `r.js` 打包的时候，必须有一个主入口文件，这个文件大致是这样的：

```js
//package.js
require(['jquery','main1'],function(){
	//TODO
});
```

其中 `main1` 又依赖领导 `main2`：

```js
//main1.js
require(['main2'],function(){
	//TODO
});
```

打包以后，你就会发现打包的文件中，会将`jquery`、`main1` 以及 `main1` 依赖的其它的模块 `main2` 一起打包进去。

这么依赖，如果一个项目很大，有些模块只有再用到才会加载，这样的话，你为了保证打包优化的时候，全部压缩进去，需要在这个入口文件 `package.js` 中 `require` 所有的模块，写一个这里加载一个，是不是太麻烦了啊？

### 问题2

使用 `r.js` 打包好的文件，总是在生成文件的最后面把这个 `package.js` 也打进去。。。我去！通过问题1我们知道，我在 `package.js` 中引入了所有的包，那么你打进去后，我只要使用require调用打包好的文件，岂不是所有模块都要执行一遍？

**Shit！**

综合，以上问题，我们有木有解决办法呢？肯定的嘛！使用构建工具，比如：`gulp`。

## require 在 gulp 中的使用

### 问题1和问题2的处理

不使用 `r.js` 打包，而是通过 `gulp` 插件 `gulp-concat` 将多个文件压缩到一个文件中。

但是还有一个问题，这样只是单纯的合并，所以，你再自己开发的时候，每个define手动增加一个 `defineName`，因为 `r.js` 会自动帮你加，而gulp不会。

比如写main1.js的时候：

```js
define('main1',[],function(){
	//TODO
});
```

而不是：

```js
define([],function(){
	//TODO
});
```

这样压缩后，自然结果跟 `r.js` 的一致，而且不会引入 `require` 模块初始化。

### 新的问题

以上解决办法，如果我们自己写的js可以搞定，但是引用第三方 `vendor` 的js，打包压缩的时候，我们又不能修改源码，怎么办呢？

继续使用 `r.js`。

这时候 `问题1` 不可避免，你必须在 `package.js` 中将需要打包的模块 `require` ，不然会不打进去。

`问题2` 也就是不希望生成的页面中，包含 `package.js`的代码。

我是这么处理的：

* `package.js` 中代码压缩成一行；
* 通过 `gulp` 的插件 `gulp-remove-lines` 将生成的文件中这一行删除掉。

大致代码如下：

```js
rjs(rjsConfig)
    .pipe(removeLines({'filters': [
        /^require\(\[/
    ]}))
```

### 最后一个问题

使用 `gulp` 我们肯定会使用 `gulp-rev` 插件为文件增加 `MD5` 值，这时候，这个就会跟 `gulp` 中 requirejs的 `r.js` 插件 `gulp-requirejs` 冲突。

也就是说，生成的文件无法 `MD5` 。

原因是，看这里：

```js
rjs(rjsConfig) //gulp中requirejs插件，使用了自己的流，所以传递到最后。
    .pipe()
```

举个例子：

不生效的代码：

```js
rjs(rjsConfig)
    .pipe(removeLines({'filters': [
        /^require\(\['/
    ]}))
    .pipe(gulpIf(build,minJs()))
	.pipe(gulpIf(build,rev())) //这里生成MD5
    .pipe(gulp.dest(c.baseDest + '/vframe/'+c.version+'/js'))
	.pipe(gulpIf(build,rev.manifest()))//这里生成MD5文件和源文件的映射
    .pipe(gulpIf(build,gulp.dest(baseDest+'/rev/js.app')));//这里将MD5的映射文件保存
```

处理后生效的代码：

```js
gulp.src(' ') //注意这里：引用一个空的路径
	.pipe(rjs(rjsConfig))//注意这里：将打包结果作为流传入
    .pipe(removeLines({'filters': [
        /^require\(\['/
    ]}))
    .pipe(gulpIf(build,minJs()))
	.pipe(gulpIf(build,rev())) //这里生成MD5
    .pipe(gulp.dest(c.baseDest + '/vframe/'+c.version+'/js'))
	.pipe(gulpIf(build,rev.manifest()))//这里生成MD5文件和源文件的映射
    .pipe(gulpIf(build,gulp.dest(baseDest+'/rev/js.app')));//这里将MD5的映射文件保存
```

希望以上总结对大家有用。