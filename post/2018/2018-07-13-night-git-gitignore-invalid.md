# GIT解惑 - 修改了.gitignore 文件不生效

有时候修改了 `.gitignore` 文件不生效，执行如下命令重新刷新下缓存就可以了。

```
git rm -r --cached .
git add .
git commit -m 'update cached'
```
另外要说的是，如果这个项目是一个团队多个人协作，那么需要每个人都执行这个命令，大家一起清理。不然你忽略了，别的人又上传了，还是不会生效。