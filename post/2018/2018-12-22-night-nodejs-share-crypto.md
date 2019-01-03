# Node crypto非对称和对称加密遇到的坑

## 一、非对称加密

非对称加密就是需要公私钥的加密方式，这种加密安全系数相对较高。

实现步骤：

### 1、生成公私钥对

使用 `openssl` 命令生成，或者一些网站也可以生成。

### 2、进行加密/解密

```js
const crypto = require('crypto');

//私钥加密
let encStr = crypto.privateEncrypt('PRIVATE KEY', Buffer.from('加密字符串', 'utf8'));

//公钥解密
let decStr = crypto.publicDecrypt('PUBLIC KEY', Buffer.from(encStr, 'utf8')).toString('utf8');
```



**以上步骤在自己电脑调试没啥问题，但是加密数据在别人电脑解密就有问题了。**

我将上面的加密后的数据写入网站cookie，别人在自己的系统中读取cookie进行解密时就报错：

```
error:0406706C:rsa routines:rsa_ossl_public_decrypt:data greater than mod len
```



网上搜索了一圈，可能的原因：

1. 公私钥有问题；
2. 要对数据进行base64处理；
3. 要对数据进行分块解密；



这个问题至今没有解决，稍后找到原因和解决方案再补充到这里！

> //TODO 待补充原因和解决方案



## 二、对称加密 

对称加密就是加解密的密码都是同一个，这个安全系数就比较低。

最初的实现方案：

```js
const CryptoJs = require('crypto-js');

//加密数据
let encStr = CryptoJS.AES.encrypt('加密字符串', '密码').toString();

//解密数据
let decStr = CryptoJS.AES.decrypt(encStr, '密码').toString(CryptoJS.enc.Utf8);
```



**以上步骤在自己电脑调试没啥问题，但是加密数据在别人电脑解密就有问题了。**

我将上面的加密后的数据写入网站cookie，别人在自己的系统中读取cookie进行解密时就报错：

```
Malformed UTF-8 data
Error: Malformed UTF-8 data
```

对于这个错误的原因是（参考：[这里](https://blog.csdn.net/swimming_in_IT_/article/details/80829600)）：

* des解密时,如果加密数据不是8的整数倍就会报上述错误

解决办法：

* 将数据加密后，再进行base64进行加密,解密时首先通过base64进行解密，然后再进行des解密。即可解决上述问题。



原因找到了，于是尝试解决方案（参考：[这里](https://gist.github.com/joecliff/10948117)）：

```js
const CryptoJs = require('crypto-js');

//加密数据
let encStr = CryptoJS.AES.encrypt('加密字符串', '密码').toString();

//对加密数据进行base64处理
//原理：就是先将字符串转换为utf8字符数组，再转换为base64数据
encInfo = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(encInfo));

//将数据先base64还原，再转为utf8数据
let data = CryptoJS.enc.Base64.parse(encInfo).toString(CryptoJS.enc.Utf8);

//解密数据
let decStr = CryptoJS.AES.decrypt(data, '密码').toString(CryptoJS.enc.Utf8);
```



**以上步骤在自己电脑调试没啥问题，但是加密数据在别人电脑解密就有问题了。**

我将上面的加密后的数据写入网站cookie，别人在自己的系统中读取cookie进行解密时还是报错。



最终的解决方案（使用 `Buffer` 获取并转换base64数据）：

```js
const CryptoJs = require('crypto-js');

//加密数据
let encStr = CryptoJS.AES.encrypt('加密字符串', '密码').toString();

//对加密数据进行base64处理
//原理：就是先将字符串转换为utf8字符数组，再转换为base64数据
encInfo = CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(encInfo));

//将数据先base64还原，再转为utf8数据
//这里使用Buffer.from替代CryptoJs的方法
//CryptoJS.enc.Base64.parse(encInfo).toString(CryptoJS.enc.Utf8)
let data = Buffer.from(encInfo, 'base64').toString('utf8');

//解密数据
let decStr = CryptoJS.AES.decrypt(data, '密码').toString(CryptoJS.enc.Utf8);
```



由于都是Node中对数据进行加解密，所以安全风险还没那么高，只需要密码不对外泄露就好。所以，目前系统中采用的方案是这种对称加密的方案，如果第1种非对称的解决了，再更换。