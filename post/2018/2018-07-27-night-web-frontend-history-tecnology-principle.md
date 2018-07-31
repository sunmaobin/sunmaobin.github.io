# 大前端的技术原理和变迁史

![](https://i.imgur.com/Fbys5PG.jpg)

本文适合前端新手入门，阅读人群最好是前端新手或者后台开发人员，因为我不敢保证对前端老司机有太多收获。

通过阅读本文，你将会大致了解前端这些年发生的事情，以及一些前端当前主流技术的简单原理介绍。所有涉及的内容，都是尽可能的让你捅破这层窗户纸，知道其大致的玩法。



## 目录

1. **前端技术发展轨迹**
   * 角色架构发展史
   * 前端技术发展史
   * ECMAScript语法发展史
   * Ajax技术发展史
2. **当前主流技术原理介绍**
   * SPA 单页面应用原理
   * Node.js 服务器端JS运行原理
   * SSR 服务器端渲染原理
   * Vue MVVM原理
   * Webpack 打包原理
   * Sass CSS编译原理
3. **一些新技术探索**
   * TypeScript
   * PWA
   * GraphQL
   * Flutter
4. **两个流行的概念解答**
   * 什么是大前端
   * 什么是前端工程化

## 一、前端技术发展轨迹

本节知识点：

- 角色架构发展史
- 前端技术发展史
- ECMAScript语法发展史
- Ajax技术发展史



### 1.1 角色架构发展史



![https://i.imgur.com/4eQJC7G.png](https://i.imgur.com/4eQJC7G.png)

Web1.0 到 Web2.0过渡的标志，就是Ajax的出现（2005年）。



### 1.2 前端技术发展史



![https://i.imgur.com/uoh8Hbn.png](https://i.imgur.com/uoh8Hbn.png)



### 1.3 ECMAScript语法发展史



<img src="https://i.imgur.com/7fCSUT7.png" width="500px">

<img src="https://i.imgur.com/6dUISoN.png" width="500px">



### 1.4 Ajax技术发展史

**AJAX** 即 **Asynchronous JavaScript and XML**（异步的 JavaScript 与 XML 技术）。



<img src="https://i.imgur.com/dHeauq0.png" width="600px">



#### STEP1：XMLHttpRequest 原生对象

```js
var request = new XMLHttpRequest();
request.open('GET', '/my/url', true);

request.onload = function() {
  if (request.status >= 200 && request.status < 400) {
    // Success!
    var data = JSON.parse(request.responseText);
  } else {
    // We reached our target server, but it returned an error

  }
};

request.onerror = function() {
  // There was a connection error of some sort
};

request.send();
```



#### STEP2：$.ajax 操作

```js
$.ajax({
    type: 'GET',
    url: '/my/url',
    data: data,
    success : function(result){
        //TODO RESULT
    }
});
```



#### STEP3：Promise 操作

```js
let getData = function (url) {
    return new Promsie(function (resolve, reject) {
        $.ajax({
            type: 'GET',
            url: url,
            success: function (data) {
                resolve(data);         
            },
            error: function (err) {
                reject(err);
            }
        });
    });
};

var data = getData('/my/url').then(function (data) {
     //TODO DATA
});
```



#### STEP4：生成器 Gererator

```Js
let it = null;
let ajax = function(url,data){
    $.ajax({
       type: 'GET',
       url: url,
       data: data || {},
       success : function(result){
			it.next(result);
       }
    });
};

function *getData(){
    var data = yield ajax('/my/url');
    console.log('data=',data);
};

it = getData();
it.next(); 
```



#### STEP5：Async/Await 高级操作

```js
let ajax = function(url,data){
    return $.ajax({
       type: 'GET',
       url: url,
       data: data || {}
    });
};

async function getData(){
    var data = await ajax('/my/url');
    console.log('data=',data);
};

getData();
```



Ajax的相关背景资料：

> 1999年，微软公司发布IE浏览器5.0版，第一次引入新功能：允许JavaScript脚本向服务器发起HTTP请求。这个功能当时并没有引起注意，直到2004年Gmail发布和2005年Google Map发布，才引起广泛重视。
>
> 2005年2月，AJAX这个词第一次正式提出，指围绕这个功能进行开发的一整套做法。从此，AJAX成为脚本发起HTTP通信的代名词，W3C也在2006年发布了它的国际标准。



## 二、当前主流技术原理介绍

本节知识点：

- SPA 单页面应用原理
- Node.js 服务器端JS运行原理
- SSR 服务器端渲染原理
- Vue MVVM原理
- Webpack 打包原理
- Sass CSS开发原理



### 2.1 SPA 单页面应用原理



什么是SPA? SPA 即单页面，就是页面整体不刷新，不同的页面只改变局部的内容的一种实现方式。

一个完整的URI有以下几部分组成：

```
scheme:[//[user[:password]@]host[:port]][/path][?query][#fragment]
```

浏览器的URL也遵循以上规则，而对于以上规则中，只有 `#` 后面的 `fragment` 发生改变时，页面不会重新请求，其它参数变化，均会引起页面的重新请求，而在Js中恰恰还有事件 `window.onhashchange` 能监听到 `fragment` 的变化，于是就利用这个原理来达到一个修改局部内容的操作。

`#fragment` 部分就是对应到Js中的 `location.hash` 的值。

直接上代码描述：

```html
<!DOCTYPE html>
    <head>
        <script type="text/javascript">
        	window.onhashchange = function(){
                var page = location.hash;
                if(page === '#home'){
                    document.getElementById('main').innerHTML = '这是首页';
                    return;
                };
                
                if(page === '#help'){
                    document.getElementById('main').innerHTML = '这是帮助页面';
                    return;
                };
                
                document.getElementById('main').innerHTML = '404';
            }
        </script>
    </head>
    <body>
        <header>
        	<a href="#home">首页</a>
            <a href="#help">帮助</a>
        </header>
        <article id="main"></article>
    </body>
</html>
```

以上代码直接在HTML上面有2个链接，点击后在页面的部分区域直接显示这2个链接对应的不同的页面内容。

![](https://i.imgur.com/atOmRct.gif)

### 2.2 Node.js 服务器端JS运行原理 



服务器上如何应用Js呢？这句话可以理解为：在非网页情况下如何运行Js程序（或者命令行如何运行）。

与Java在服务器上运行需要按照JDK一样，Js要运行也需要安装Node环境，安装以后就可以运行了，具体的可以对照着Java程序来解释说明。

<img src="https://i.imgur.com/fPXfT8A.png">



### 2.3 SSR 服务器端渲染原理



用过Java的人一定对 `FreeMarker` 不陌生，其工作原理：

![](https://freemarker.apache.org/images/overview.png)



对于Node.js来说也是一样，只是使用的框架不是FreeMarker罢了！究其原理无非都是：

`Template + Data = Output`



只是现在前端说的这个SSR，其实就是指后台渲染好数据，直接返回到浏览器，浏览器就直接显示了，下面我们做一个对比，用来说明传统的AJax操作和SSR之间的区别。



#### 使用Ajax操作数据渲染到页面

```Html
<!DOCTYPE html>
    <head>
        <script type="text/javascript" src="lib/jquery.min.js"></script>
        <script type="text/javascript">
            /**
             * 使用jQuery将后台接口返回的数据显示到页面上
             */
            function renderData(){
                $.post(url,param,function(result){
                    //假设返回的是是一个List，我们追加到页面的ul中
                    $.each(result,function(i,d){
                        $('#list').append('<li>' + d.name + '</li>');
                    })
                });  
            };
            renderData();
        </script>
    </head>
    <body>
        <ul id="list"></ul>
    </body>
</html>
```

主要流程如下：

* 用户地址栏输入URL
* 浏览器使用HTTP协议从后台获取资源
* 浏览器解析并渲染HTML页面呈现到浏览器上，同时异步执行Ajax操作
* 浏览器发送Ajax请求后台接口
* 浏览器获取到数据后，执行回调函数，将内容动态追加到页面上



#### 使用SSR技术显示页面

下面示例我们以Vue框架后台直出方案为例：

```js
const Vue = require('vue')
const server = require('express')()
const renderer = require('vue-server-renderer').createRenderer()

server.get('*', (req, res) => {
  //vue对象包含了template+data
  const app = new Vue({
    data: {
        list: [{
            name : 'lilei'
        },{
            name : 'hanmeimei'
        }]
    },
    template: `<ul><li v-for="item in list">{{item.name}}</li></ul>`
  })

  //将vue对象传入最终返回output结果html
  //再将html通过reponse对象返回给前端浏览器
  renderer.renderToString(app, (err, html) => {
    res.end(`
      <!DOCTYPE html>
      <html>
        <body>${html}</body>
      </html>
    `)
  })
})

server.listen(8080)
```

主要流程如下：

* 用户地址栏输入URL
* 浏览器使用HTTP协议从后台获取资源
* 浏览器解析并渲染HTML页面呈现到浏览器上



<img src="https://i.imgur.com/9NOXluX.png" width="500px">

如果有人对这个vue示例的完整构建流程感兴趣，可以按照如下流程快速搭建环境并允许起来：

* 下载并安装Nodejs：https://nodejs.org/zh-cn/download/
* 新建一个目录，打开命令窗口，切换到当前目录
* 执行命令：npm init，一直回车进行下一步，快速创建一个node工程
* 安装所需要的js包：npm i vue express vue-server-renderer --save-dev
* 新建文件：vi index.js，将上面的vue代码片段全部粘贴进去
* 执行文件启动Node程序：node index.js
* 打开浏览器访问：http://localhost:8080（注意端口号不要跟本地已有程序冲突）



### 2.4 Vue MVVM原理 



什么是MVC？什么是MVVM？



<img src="https://i.imgur.com/7OGnIHT.png" width="500px">



通过上图可以清晰的看到，MVVM相比MVC来说，缺少了 `Controller` 一层，传统 `Controller` 做的事情就是处理一堆复杂的逻辑，然后将数据输出到 `View` 上面。那么现在缺少了这一层以后，`View` 和 `ViewModel` 之间如何进行双向自动关联数据绑定的呢？

也就是说，页面上数据发生变化，Js中的数据如何跟着也变化；相反，Js中数据变化了，页面如何自动跟着变化？

<img src="https://i.imgur.com/8hzuxAp.png" width="500px">



举个例子来进一步阐明这个问题，下面的效果如何实现？

<img src="https://i.imgur.com/rjr1CoX.gif" width="300px">



#### 页面数据发生变化如何通知到JS

通过给页面元素添加 `onchange` 或者 `oninput` 事件，在事件中获取表单的值，然后赋值给Js对应的对象上即可。

比如：示例中的输入框就可以添加oninput事件

```html
<input type="text" oninput="evtInput" />
```

然后在js中定义这个函数执行相关赋值操作就可以：

```js
function evtInput(){
    vue.name = this.value;
}
```



#### JS数据变化如何通知到页面

JavaScript原生有个方法 `Object.defineProperty()` ，这个方法可以重新设置一个js对象中某个元素的一些属性，同时提供了 `get` 和 `set` 方法，允许用户对元素进行重新赋值和取值操作。

<img src="https://i.imgur.com/1ywpTPC.png" width="500px">



简单分析一下代码：



<img src="https://i.imgur.com/k34ezEr.png" width="600px">

正式由于我们可以通过拦截一个属性的 `set` 方法。所以，我们就可以在 `set` 方法中讲获取到的新值赋值给页面元素就可以了。

```js
Object.defineProperty(data,'name',{
    set : function(v){
		document.getElementById('input').value = v;
	}
});
```



### 2.5 Webpack 打包原理



#### 前端为什么要打包？

那么前端为什么要进行打包呢？前端代码不是直接就能运行到浏览器么，还打包干嘛？



要搞清楚这个问题，那么我们就以java为例可能比较恰当，比如：java的工程目录中有一个源码目录：`src`

它是用来存放java源码的，但是java实际编译后肯定就没有src这个目录了对吧？



那么 `src` 源码的作用是什么呢？就是用来更好的归类整理我们的源代码，它有可能是跟我们实际运行的代码结构完全不一样，因为实际运行的是机器能读懂的，而源码是给人看的。



所以前端也一样，由于当前阶段，前端的业务逻辑也变的非常复杂，再不是传统意义上的一个 html、一个js、一个css就能搞定的。所以我们要分模块，分目录存放源码，最终通过打包再组装成浏览器可以读懂的代码和目录结构。



比如：我们通过vue的脚手架创建一个vue的webpack项目，看看它的默认的源码目录（src）的树结构：

```
src
├── App.vue
├── assets
│   └── logo.png
├── components
│   └── HelloWorld.vue
├── main.js
└── router
    └── index.js
```

src中除了有3个子目录 `assets` `components` `router` ，还有2个 `.vue` 结尾的文件。所以，这种目录结构和文件在浏览器中肯定是无法运行的，如果我们要运行，就必须对它进行编译，翻译成浏览器能读懂的html/js/css文件才行。

当我们打包以后，看到项目的dist目录下就有了编译以后的，浏览器可执行的代码结构：

```
dist
├── index.html
└── static
    ├── css
    │   ├── app.30790115300ab27614ce176899523b62.css
    │   └── app.30790115300ab27614ce176899523b62.css.map
    └── js
        ├── app.b22ce679862c47a75225.js
        ├── app.b22ce679862c47a75225.js.map
        ├── manifest.2ae2e69a05c33dfc65f8.js
        ├── manifest.2ae2e69a05c33dfc65f8.js.map
        ├── vendor.7fed9fa7b7ba482410b7.js
        └── vendor.7fed9fa7b7ba482410b7.js.map
```



所以，当前前端代码逻辑复杂，各种框架横行的年代，源码都是不能直接在浏览器访问的，都需要借助打包工具，如：gulp、webpack这些工具进行打包翻译，才能得到真正的可执行的文件。



####Webpack 打包原理

一句话概括Webpack的本质：

> webpack 是一个打包模块化js的工具，可以通过Loader转换文件，通过Plugin扩展功能。



Webpack打包的简易示意图：

![](https://i.imgur.com/8XpFnpN.png)



### 2.6 Sass CSS编译原理



什么是Sass？就是一种能提高CSS开发效率的工具。

其编译原理是：



<img src="https://i.imgur.com/UlHsAbi.png" width="170px">



**实际在项目中怎么用Sass呢？**

前面在说Webpack的时候说过了，现在前端技术离开打包工具是不能直接运行 ，类似于这种Sass文件也一样。所以，我们只需要在Webpack中增加Sass文件的Loader，这样在代码编译环境，就能自动把Sass文件转换为Css文件，最后引入到Html中的是Css文件，这样页面就能正常渲染了。



**Sass有什么好处？**

test.scss文件：

```scss
$color-red: #00ff00;
$color-white: #ffffff;

#main p {
  color: $color-red;
  width: 97%;

  .redbox {
    background-color: $color-red;
    color: $color-white;
  }
}
```



如果用传统的css写：

```css
#main p {
  color: #00ff00;
  width: 97%; 
}

#main p .redbox {
    background-color: #00ff00;
    color: #ffffff; 
}
```



## 三、一些新技术探索

本节知识点：

- TypeScript
- PWA
- GraphQL
- Flutter



### 3.1 TypeScript



什么是TypeScript？

> TypeScript 是微软开源发布的JavaScript类型的超集，它可以编译成纯JavaScript。
>
> 它是一个Js框架，可以用来开发前端系统。

之所以说TypeScript是JavaScript的超集，就意味着TypeScript在JavaScript的语法基础上，又扩展了更多语法，使得开发更加方便。



接下来我们看看TypeScript的相比JavaScript额外增加的部分：

> 学Java的同学不要惊慌，个人看来TypeScript就是把Java用JavaScript重新实现了一遍！



**1、强数据类型**

```typescript
//Boolean类型
let isDone: boolean = false;

//数字类型
let decLiteral: number = 6;

//字符串
let name: string = "bob";

//数组
let list: Array<number> = [1, 2, 3];

//函数定义
function add(x: number, y: number): number {
    return x + y;
}
```



**2、接口**

```typescript
interface LabelledValue {
  label: string;
}

function printLabel(labelledObj: LabelledValue) {
  console.log(labelledObj.label);
}

let myObj = {size: 10, label: "Size 10 Object"};
printLabel(myObj);
```

> 这里的接口与Java中的接口不一样，TypeScript中的接口仅仅是对参数的一种契约约定，即：参数必须是接口定义的结构和参数名等。



**3、类**

```typescript
//定义类
class Greeter {
    greeting: string;
    constructor(message: string) {
        this.greeting = message;
    }
    greet() {
        return "Hello, " + this.greeting;
    }
}

let greeter = new Greeter("world");

//类的继承
class Animal {
    move(distanceInMeters: number = 0) {
        console.log(`Animal moved ${distanceInMeters}m.`);
    }
}

class Dog extends Animal {
    bark() {
        console.log('Woof! Woof!');
    }
}

//共有、私有变量、方法
class Animal {
    private id: number; //仅类内部访问，实例无法访问
    public name: string;//类内部和实例都可以访问
    protected pid: number;//仅类内部和子类可以访问
    
    public constructor(theName: string) { this.name = theName; }
    public move(distanceInMeters: number) {
        console.log(`${this.name} moved ${distanceInMeters}m.`);
    }
}
```



**4、泛型**

```typescript
function identity<T>(arg: T): T {
    return arg;
}
```



**5、枚举**

```typescript
enum Direction {
    Up = 1,
    Down,
    Left,
    Right
}
```



### 3.2 PWA ###

什么是PWA？

> Progressive Web App, 简称 PWA，是渐进式提升 Web App 的体验的一种新方法，能给用户原生应用的体验。
>
> PWA 本质上是 Web App，就是运行在手机上的App不是纯Native的，而是很多页面都是网页。



`Web App` ，我们都知道就是App中有网页嘛！但是 `Progressive`  `渐进式` 又该怎么理解？

个人理解，`渐进式` 的意思就是：`循序渐进的发展或者改造`。



PWA更直白的意思就是：

> 第一步：我们现在要开发一个App，但是开发纯原生App的维护和扩展成本太高，所以我们需要增加一些网页进去，毕竟网页好维护嘛！（这部分其实就是混合类App，也叫：Hybrid App）
>
>  第二步：但是我们App中增加网页不能太暴力，太暴力容易让用户觉得很不自然，所以需要使用循序渐进的方式进行，那么如何循序渐进的进行才能让用户的体验达到极致（也就是几乎看不出来某一个页面是一个网页！）
>
> 第三步：我们就需要增加一些策略，先保证用户体验，比如：为了保证安全网页全部使用HTTPS、使用离线缓存来减少用户打开页面的等待时间等等。



所以，PWA就是以循序渐进的方式，提升混合类APP的用户体验，而影响体验最大的问题就是页面加载，所以PWA最核心的技术就是：`离线缓存` ，离线缓存大家普遍采用的方案就是：`Service Worker`



### 3.3 GraphQL

在了解什么是GraphQL之前，我们先了解一下什么是SQL？



什么是SQL？

> Structured Query Language，一种结构化的查询语言，它是关系式数据库管理系统的标准语言。

说白了，SQL是一种特定的语法，也可以称之为是数据库管理的API，操作数据库必须通过这个语法进行。



什么是GraphQL呢？

> 一种用于API的查询语言
>
> GraphQL 既是一种用于 API 的查询语言也是一个满足你数据查询的运行时。 GraphQL 对你的 API 中的数据提供了一套易于理解的完整描述，使得客户端能够准确地获得它需要的数据，而且没有任何冗余，也让 API 更容易地随着时间推移而演进，还能用于构建强大的开发者工具。



用一组图来说明下：

<img src="https://i.imgur.com/5eJ3c9Q.png" width="300px">



那你又要说了？没有GraphQL我现在客户端和后台之间不照样可以交互吗？

没错！你是这么交互的：

<img src="https://i.imgur.com/AXxDOzz.png" width="300px">



所以，不是说离开GraphQL我们就不能活，而是它给我们提供了一种全新的API查询交互方式，使得客户端和后台的接口通信更加高效罢了。



那么GraphQL相比传统的接口请求，都有哪些优势呢？

**1、所见即所得**

```js
//查询条件
{
    user(uid:1) {
        uid
        name
    }
}

//返回结果
{
  "data": {
    "user": {
      "uid": "1",
      "name": "xxx"
    }
  }
}
```

传统的API是什么样子？

```js
//查询条件
{
    uid : 1
}

//返回结果
{
  "data": {
    "user": {
      "uid": "1",
      "name": "xxx"
    }
  }
}
```



**2、减少网络请求次数**

只需要一次网络请求，就能获得资源和子资源的数据（例如，上文中文章的评论信息）。

```js
//查询条件
{
    article(aid:1) {
        title
        content
        author {
            uid
            name
        }
    },
    comment {
        content,
        author {
            uid
            name
        }
    }
}
```

传统的查询，一般先查询Article，再查询Comment。当然你可以一次性去查，让后台一次性返回来，但是一般没有后台会给你设计这样的一个API：`getArticleAndComment`，如何按照Restful的接口标准，你应该需要查询2次。



**3、参数类型强校验**

GraphQL规定了一套数据类型，这就保证接口查询的时候，字段类型就被明确定义，而传统的接口一般很难保证查询参数的类型。

比如，以下就是GraphQL的语法定义：

```js
type Starship {
  id: ID!
  name: String!
  length(unit: LengthUnit = METER): Float
}
```



### 3.4 Flutter

什么是Flutter？

> Flutter是谷歌的移动UI框架，可以快速在iOS和Android上构建高质量的原生用户界面。 



下图就是使用Flutter开发一款App的样子：

![](https://cdn.flutterchina.club/images/intellij/hot-reload.gif)



类似于 `React Native` 框架一样，Flutter也是可以调用一些App系统级的命令，能让你快速开发一款混合类App（Hybrid App）。



有兴趣的可以去官网学习：[Flutter中文网](https://flutterchina.club/)



## 四、两个流行的概念解答

本节知识点：

- 什么是大前端
- 什么是前端工程化



### 4.1 什么是大前端

本文的标题是 `大前端的技术原理和演变史`，现在给大家解答一下，什么是：`大前端`。

`大前端` 就是相比 `前端` 而言变大了，那么到底传统意义的前端指什么？变成大前端又有哪些东西变大了呢？



传统的意义的前端指是什么呢？

> 传统的前端就是指直接面对客户的应用或者系统，比如：网页、手机App。
>
> 而开发网页、搞iOS和Android开发的程序员都可以称之为前端工程师。
>
> 只是传统意义来说，前端工程师仅仅指网页开发的人，而iOS和Android开发的一般指客户端开发人员，或者归结到软件工程师岗位去了。



那么大前端又指什么呢？其实经过各种资料考证，并没有这么一个明确的定义，只是随着技术的进步，大家有了一种默认的约定，大前端之所以称之为大前端，主要体现在以下一些方面：



**1、大前端 - 前后端分离**

随着前后端职责和技术框架的分离发展，产品对前端的要求越来越高，用户对前端的期待越来越高，前端技术发展越来越快，导致前端这个岗位并没有像JSP时代那种画画页面就完事了。这部分体现的是前端的要求更高，责任越大了。



**2、大前端 - Node全栈**

前后端分离后，前端要独立完成一个事情是不行的，因为缺少后台的支持。但是随着Node的出现，前端可以不用依赖后台人员，也不用学习新的后台语言，就可以轻松搞定后台的这部分事情。这样，面对一些小的系统，前端工程师就可以搞定整个系统。这部分体现了前端的全面性和全栈性。



**3、大前端 - 应对各种端**

传统的前端工程师，一般指网页开发工程师，网站一般指运行在PC浏览器，慢慢的也要运行在手机上。但是，随着移动互联网的发展，突然冒出来更多的移动设备，比如：手机分为Android手机和苹果手机、智能手表、VR/AR技术支撑的可穿戴设备、眼睛、头盔、车载系统、智能电视系统等等。而这些设备都需要前端的支撑，这时候对前端的技术要求、能力要求就更高。这部分体现了前端的涉猎范围变大。



**4、大前端 - 微应用**

当微信小程序出来以后，大家第一感觉是前端又可以火一把啦，不需要后台、不需要服务端，只需要在微信平台上开发网页就可以发布上线了。

而近期又有国内多个手机厂家联合推出 `快应用` , 跟小程序差不多，只是通过简单的前端开发发布以后，用户不需要安装应用就可以直接在类似于小米、vivo、oppo等手机上打开这样的应用。

类似于这些微应用，免后台、免安装的形式出现，也促使了前端这个行业也将涉及到这样的新型领域中，一起推动技术的进步。这部分体现了前端是时代发展的幸运儿。



综上所述，我们可以得到一个大致的定义：

> 大前端指前端涉猎范围越来越广、涉及的端越来越多、技术要求越来越高、影响范围越来越大的一种体现。



### 4.2 什么是前端工程化

前端工程化的定义：

> 前端工程化是根据业务特点，将前端开发流程规范化，标准化，它包括了开发流程，技术选型，代码规范，构建发布等，用于提升前端工程师的开发效率和代码质量，最终交付一个稳定性高、扩展性好、易于维护的系统的过程。



一般情况下，一个符合前端工程化要求的方案应该包含以下要素：

- 开发规范
- 模块化开发
- 组件化开发
- 组件仓库
- 性能优化
- 部署
- 开发流程
- 开发工具



另外，我们再谈到工程化，不能只想着前端工程化，而应该站在整个系统考虑如何进行工程化，也就是说对于一整个项目，我们谈到工程化应该考虑哪些因素呢？



![](https://i.imgur.com/1PqV46e.png)



一个系统的工程化建设，应该包含以下因素：

* 目标，搞清楚目标群体，并持续为他们做好最优质的服务；
* 边界，与别的系统划清界限，同时做好接口，保证自身系统职责定位清晰的同时，管理好依赖系统，增加自身健壮性；
* 壁垒，自身平台建设，其中就包含了前端工程化建设，以及后台工程化建设，还有项目整体建设等诸多因素。



## 参考资料

* [前端开发的历史和趋势-阮一峰](https://github.com/ruanyf/jstraining/blob/master/docs/history.md)
* [JavaScript语言的历史-阮一峰](https://javascript.ruanyifeng.com/introduction/history.html)
* [关于原生JS的AJAX](https://www.jianshu.com/p/94c12c6bfbe6)
* [JavaScript异步编程](https://segmentfault.com/a/1190000015711829)
* [YOU MIGHT NOT NEED JQUERY](http://youmightnotneedjquery.com/)
* [Going Async With ES6 Generators](https://davidwalsh.name/async-generators)
* [统一资源标志符-维基百科](https://zh.wikipedia.org/wiki/%E7%BB%9F%E4%B8%80%E8%B5%84%E6%BA%90%E6%A0%87%E5%BF%97%E7%AC%A6)
* [统一资源定位符-维基百科](https://zh.wikipedia.org/wiki/%E7%BB%9F%E4%B8%80%E8%B5%84%E6%BA%90%E5%AE%9A%E4%BD%8D%E7%AC%A6)
* [剖析Vue实现原理 - 如何实现双向绑定mvvm](https://github.com/DMQ/mvvm)
* [Vue.js 服务器端渲染指南](https://ssr.vuejs.org/zh/)
* [Webpack:Output Management](https://webpack.js.org/guides/output-management/)
* [webpack原理与实战-gwuhaolin/blog](https://github.com/gwuhaolin/blog/issues/4)
* [TypeScript Handbook（中文版）](https://zhongsp.gitbooks.io/typescript-handbook/)
* [什么是 PWA](https://lavas.baidu.com/pwa/README)
* [GraphQL和RESTful的比较](https://segmentfault.com/a/1190000012878342)
* [当我们在谈大前端的时候，我们谈的是什么](http://www.infoq.com/cn/articles/talking-about-daqianduan)
* [前端工程——基础篇-张云龙](https://github.com/fouber/blog/issues/10)