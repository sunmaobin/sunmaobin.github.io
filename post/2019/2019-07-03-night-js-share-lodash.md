# 经验分享-Lodash 常用方法说明之抛砖引玉

由于 Lodash 是一个非常强大的工具类，提供了非常多的工具方法，所以这里仅仅罗列一部分常用的方法，供大家参考。

如果想了解更全的，建议到官网去仔细过一遍，学习一下：[https://www.lodashjs.com/docs/latest](https://www.lodashjs.com/docs/latest)，以备不时之需。

## Array 数组

### _.uniq

数组去重，返回一个去重后的新数组。

参数：

* Array，数组

示例：

```js
_.uniq([2, 1, 2]);
// => [2, 1]
```



### _.uniqBy

这个方法类似 `_.uniq`，不过可以接收一个回调函数，数组中每一个值会调用一遍回调函数，之后再去重。

参数：

* Array，数组
* callback，回调函数，传入参数：value

示例：

```js
// 数组每一个元素向下取整后比较去重
_.uniqBy([2.1, 1.2, 2.3], Math.floor);
// => [2.1, 1.2]

// 取得对象中每个x的值进行比较去重
_.uniqBy([{ 'x': 1 }, { 'x': 2 }, { 'x': 1 }], value => value.x);
// => [{ 'x': 1 }, { 'x': 2 }]
```



### _.uniqWith

这个方法类似 `_.uniq`，不过可以接收一个回调函数，回调函数会传入要不比较的2个对象值，比较结果按函数的结果来执行。

参数：

- Array，数组
- callback，回调函数，传入2个参数：当前值 和 其它待比较值

示例：

```js
var objects = [{ 'x': 1, 'y': 2 }, { 'x': 3, 'y': 4 },  { 'x': 1, 'y': 6 }];

_.uniqWith(objects, (arrVal, othVal) => {
	return arrVal.x === othVal.x;
});
// [{ 'x': 1, 'y': 2 }, { 'x': 3, 'y': 4 }]
```





## Object 对象

### _.pick

创建一个从 `object` 中选中的 `key` 的对象。

参数：

* Object，对象
* Keys，对象的key的数组

示例：

```js
var object = { 'a': 1, 'b': '2', 'c': 3 };
_.pick(object, ['a', 'c']);
// => { 'a': 1, 'c': 3 }
```



### _.pickBy

创建一个从 `object` 中经 `value` 函数判断为真值的属性为对象。

参数：

* Object，对象
* Function(value)，判断函数，参数为每一个value

示例：

```js
var object = { 'a': 1, 'b': '2', 'c': 3 };

_.pickBy(object, (value) => {return _.isNumber(value)};
// => { 'a': 1, 'c': 3 }
```



### _.omit

反向版 `pick`, 返回忽略 `key` 之外的自身和继承的可枚举属性。

参数：

- Object，对象
- Keys，对象的key的数组

示例：

```js
var object = { 'a': 1, 'b': '2', 'c': 3 };
_.omit(object, ['a', 'c']);
// => { 'b': '2' }
```



### _.omitBy

反向版 `pickBy` ，创建一个不是从 `object` 中经 `value` 函数判断为真值的对象。

参数：

- Object，对象
- Function(value)，判断函数，参数为每一个value

示例：

```js
var object = { 'a': 1, 'b': '2', 'c': 3 };

_.omitBy(object, value => {return _.isNumber(value)};
// => { 'b': '2' }
```



### _.mapValues

遍历所有的 `value`，返回处理后的对象。

参数：

* Object，对象

* Function(value, key, object)，判断函数

示例：

```js
var users = {
  'fred':    { 'user': 'fred',    'age': 40 },
  'pebbles': { 'user': 'pebbles', 'age': 1 }
};

_.mapValues(users, value => { return value.age; });
// => { 'fred': 40, 'pebbles': 1 } (无法保证遍历的顺序)
```



### _.mapKeys

反向版 `_.mapValues`。 遍历所有的 `key`，返回处理后的对象，返回对象的value跟处理前一样。

参数：

- Object，对象

- Function(value, key, object)，判断函数

示例：

```js
_.mapKeys({ 'a': 1, 'b': 2 }, function(value, key) {
  return key + value;
});
// => { 'a1': 1, 'b2': 2 }
```



### _.merge

合并对象，注意几个细节：

* 合并来源中，如果属性值为 undefined ，会忽略，不会覆盖原有值；
* 数组和普通对象会递归合并，也就是：求并集。其它对象，会直接覆盖原对象；
* 支持多个目标源，也就是参数可以无限制（...sources）

参数：

* Object，对象
* sources，...Object 可以传多个合并源

示例：

```js
var users = {
  'data': [{ 'user': 'barney' }, { 'user': 'fred' }]
};

var ages = {
  'data': [{ 'age': 36 }, { 'age': 40 }]
};

_.merge(users, ages);
// => { 'data': [{ 'user': 'barney', 'age': 36 }, { 'user': 'fred', 'age': 40 }] }
```



### _.findKey

这个方法类似 `_.find`，只是返回的是 `key`。还有个 `findLastKey` ，不过是反向遍历对象。

这个方法主要用于的场景：后台返回的List，我们需要过滤后得到指定的所有key。

参数：

- Object，对象
- callback，回调函数

示例：

```js
var users = {
  'barney':  { 'age': 36, 'active': true },
  'fred':    { 'age': 40, 'active': false },
  'pebbles': { 'age': 1,  'active': true }
};

_.findKey(users, function(o) { return o.age < 40; });
// => 'barney' (无法保证遍历的顺序)

// 使用了 `_.matches` 的回调结果
_.findKey(users, { 'age': 1, 'active': true });
// => 'pebbles'

// 使用了 `_.matchesProperty` 的回调结果
_.findKey(users, ['active', false]);
// => 'fred'

// 使用了 `_.property` 的回调结果
_.findKey(users, 'active');
// => 'barney'
```



## Collection 集合

注意：Collection 模块表示 Object 或 Array 都支持

### _.map

创建一个经过 回调函数处理的集合中每一个元素的结果数组。 

参数：

* collection，集合
* callback，回调函数

示例：

```js
function square(n) {
  return n * n;
}

// 遍历数组
_.map([4, 8], square);
// => [16, 64]

// 遍历对象
_.map({ 'a': 4, 'b': 8 }, square);
// => [16, 64] (无法保证遍历的顺序)
```



### _.includes

检查 值 是否在 集合中，如果集合是字符串，那么检查 值 是否在字符串中。 

参数：

* collection，集合
* value，要检查的值
* fromIndex，要检索的位置

示例：

```js
// 集合中是否包含1
_.includes([1, 2, 3], 1);
// => true

// 集合下标为2的位置是否等于1
_.includes([1, 2, 3], 1, 2);
// => false

// 对象中是否包含value=fred
_.includes({ 'user': 'fred', 'age': 40 }, 'fred');
// => true

// 字符串中是否包含 eb 这2个连续的字母
_.includes('pebbles', 'eb');
// => true
```



## Util 工具

### _.property

返回指定对象的 `key` 的值的数组，支持多层属性嵌套获取，如：`obj.x.y.z`

参数：

- Object，对象
- path，路径，如：`obj.x.y.z`

示例：

```js
var objects = [
  { 'a': { 'b': { 'c': 2 } } },
  { 'a': { 'b': { 'c': 1 } } }
];

_.map(objects, _.property('a.b.c'));
// => [2, 1]
```



### _.cloneDeep

递归拷贝对象，对应的 `_.clone` 是浅拷贝。

参数：

- Object，被拷贝对象

示例：

```js
var objects = [{ 'a': 1 }, { 'b': 2 }];

var deep = _.cloneDeep(objects);

// 深拷贝后数组中的对象已经不是同一个
console.log(deep[0] === objects[0]);
// => false
```



### _.isArray

检查 `value` 是否是 `Array` 类对象。

参数：

* value，要检查的对象

示例：

```js
_.isArray([1, 2, 3]);
// => true

_.isArray(document.body.children);
// => false

_.isArray('abc');
// => false

_.isArray(_.noop);
// => false
```



### _.isEmpty

检查 `value` 是否为空。

注意：该方法主要适用于Collection 或 Object，尤其不适用于Number、Boolean等值，下面会详细说明。

参数：

- value，要检查的对象

示例：

```js
_.isEmpty(null);
// => true

_.isEmpty(undefined);
// => true

_.isEmpty([]);
// => true

_.isEmpty({});
// => true

_.isEmpty("");
// => true

_.isEmpty([1, 2, 3]);
// => false

_.isEmpty({ 'a': 1 });
// => false
```

注意以下特殊示例（Boolean 和 Number）：

关于这是不是个bug，可以看下讨论区：https://github.com/lodash/lodash/issues/496

```js
_.isEmpty(true);
// => true

_.isEmpty(false);
// => true

_.isEmpty(123);
// => true
```

由于 isEmpty 不能有效判断 Boolean 和 Number ，所以，使用这个函数的需要特别小心，最好自己再封装一个函数，做下容错。

比如，你只考虑如下场景，那么自己封装一下：

```js
function isEmpty(value) {
    return _.isEqual(a, {}) 
    	|| _.isEqual(a, []) 
    	|| _.isEqual(a, '') 
    	|| _.isEqual(a, null)
    	|| _.isEqual(a, undefined);
}
```

如果不确定自己的数据类型，那么就不推荐使用 `_.isEmpty` 这个函数。



## Function 函数

### _.throttle

节流函数，控制操作频次，在 `wait` 秒内最多执行 `func` 一次的函数。

注意：这里 `最多` 的意思其实隐含说明了js里面事件轮循的一个问题，可能会受执行栈影响而导致不能在 `settimeout` 时间内执行。

参数：

1. func，(Function) 要节流的函数

2. [wait=0]，(number) 需要节流的毫秒

3. [options]，(Object) 选项对象

   - leading，默认true，动作开始时，立即执行一次func

   - trailing，默认true，动作结束时，再等待wait时间后，再执行一次func

示例：

```js
// 避免在滚动时过分的更新定位
jQuery(window).on('scroll', _.throttle(updatePosition, 100));

// 点击后就调用 `renewToken`，但5分钟内超过1次。
var throttled = _.throttle(renewToken, 300000, { 'trailing': false });
jQuery(element).on('click', throttled);

// 取消一个 trailing 的节流调用
jQuery(window).on('popstate', throttled.cancel);
```

注意事项：

```js
// 错误
jQuery(window).on('scroll', function() {
   _.debounce(doSomething, 300); 
});
// 正确
jQuery(window).on('scroll', _.debounce(doSomething, 200));
```



### _.debounce

> n. 防反跳
> 按键防反跳（Debounce）为什么要去抖动呢？机械按键在按下时，并非按下就接触的很好，尤其是有簧片的机械开关，会在接触的瞬间反复的开合多次，直到开关状态完全改变。

创建一个防抖动函数。 该函数会在 `wait` 毫秒后调用 `func` 方法。 

参数：

1. func，(Function) 要节流的函数

2. [wait=0]，(number) 需要节流的毫秒

3. [options]，(Object) 选项对象

   - leading，默认false，动作开始时，立即执行一次func

   - trailing，默认true，动作结束时，再等待wait时间后，再执行一次func
   - maxWait，最大等待时间（比如：设置一个动作结束2秒后执行func，但是这个动作一直不结束，那么func就永远不会执行，maxWait就是保证你等待这个动作的最长时间，否则就立即执行一次。）

示例：

```js
// 避免窗口在变动时出现昂贵的计算开销。
jQuery(window).on('resize', _.debounce(calculateLayout, 150));

// 当点击时 `sendMail` 随后就被调用。
jQuery(element).on('click', _.debounce(sendMail, 300, {
  'leading': true,
  'trailing': false
}));

// 确保 `batchLog` 调用1次之后，1秒内会被触发。
var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
var source = new EventSource('/stream');
jQuery(source).on('message', debounced);

// 取消一个 trailing 的防抖动调用
jQuery(window).on('popstate', debounced.cancel);
```



## 参考资料

* [Lodash 官方中文文档 v4.17.11](https://www.lodashjs.com/docs/4.17.11)
* [实例解析防抖动（Debouncing）和节流阀（Throttling）](https://jinlong.github.io/2016/04/24/Debouncing-and-Throttling-Explained-Through-Examples/)
* [Javascript 的 Debounce 和 Throttle 的原理及实现](https://github.com/lishengzxc/bblog/issues/7)



