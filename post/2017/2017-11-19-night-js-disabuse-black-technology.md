# JS解惑-那些经常用但是又叫不起名字的知识

## Vanilla JS

世界上最轻量的 `JavaScript` 框架！

* http://vanilla-js.com/
* https://segmentfault.com/a/1190000000355277
* https://github.com/sunmaobin/sunmaobin.github.io/issues/29

## Trailing Comma

```js
{
    "id" : 1,
    "name" : "张三", // 注意这个逗号！
}
```

## 立即执行函数

即函数的定义和执行同时进行。

* 首尾加括号包裹函数体

```js
(function(){
console.log('here');
}());
```

* function外面加括号

```js
(function(){
console.log('here');
})();
```

* function前面加运算符

```js
!function(){
console.log('here');
}()
```

或者

```js
void function(){
console.log('here');
}()
```

> 更多 : https://github.com/sunmaobin/sunmaobin.github.io/issues/15


## UMD

```js
// Uses CommonJS, AMD or browser globals to create a jQuery plugin.

(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else if (typeof module === 'object' && module.exports) {
        // Node/CommonJS
        module.exports = function( root, jQuery ) {
            if ( jQuery === undefined ) {
                // require('jQuery') returns a factory that requires window to
                // build a jQuery instance, we normalize how we use modules
                // that require this pattern but the window provided is a noop
                // if it's defined (how jquery works)
                if ( typeof window !== 'undefined' ) {
                    jQuery = require('jquery');
                }
                else {
                    jQuery = require('jquery')(root);
                }
            }
            factory(jQuery);
            return jQuery;
        };
    } else {
        // Browser globals
        factory(jQuery);
    }
}(function ($) {
    $.fn.jqueryPlugin = function () { return true; };
}));
```

* https://github.com/umdjs/umd/blob/master/templates/jqueryPlugin.js
* https://github.com/umdjs/umd

## Protocol-relative URL

翻译成中文可以称之为：`相对协议URL`，即：省略路径前面的具体协议名，只保留 `//`。

* 示例：

```html
<script src="//ajax.googleapis.com/ajax/libs/jquery/1.4.2/jquery.js"></script>
```

（全文完）
