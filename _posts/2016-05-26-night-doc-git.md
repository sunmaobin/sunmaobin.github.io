---
title:  Git入门介绍
date:   20160526091044
categories: [技术]
tags: [git,svn,vcs]
---

本文主要从Git原理、常用命令、分支管理等方面进行简单介绍说明。

## Git 和 Svn 的区别

1. Git是分布式的管理，而Svn不是
	* Git的这个特性可以保证，每个使用Git的人员，本地都有一个独立的库跟远端相同。这样做的好处是，如果哪天断网了，或者在公司Clone的代码到家里了。这时候依然可以Add，Commit，依然可以查看版本记录。
1. Git的分支管理和Svn有很大区别
	* Git的分支之间可以随意合并、切换，而Svn的分支就相当于是一个额外的目录。
	* Git的分支使用要比Svn更加有优势，更加适合于快速开发、分块交付的工作。
1. Git数据存储方式和Svn大不一样
	* 这主要表现在Git一个仓库目录下有一个.git隐藏目录，用于存储git的数据信息，而仓库内部的所有文件就没有了.git临时文件。这样做的好处是，你可以随意的拷贝/挪动，而不需要考虑隐藏文件占很大的磁盘。而Svn是每个目录下都有一个.svn目录，用于控制版本和数据信息。有时候挪动了整个目录，切换了Svn的地址，需要clean等操作，非常麻烦，而且占的体积非常大。
	* 当然Git的这种存储有更大的作用，就是他实际存储了整个库到本地了，所以平时更新提交数据非常快。
	* 更多数据存储，参考：[Git是如何存储对象的？](http://gitbook.liuhui998.com/7_1.html)

## Git 架构

![](http://www.ruanyifeng.com/blogimg/asset/2015/bg2015120901.png)

`注：此图片来自阮一峰博客`

## Git 安装配置

1. host中添加以下内容：   
	host所在目录：C:\Windows\System32\drivers\etc\   
	>  
	192.168.1.68 git.gdd      
	192.168.1.68 jenkins.gdd     
	192.168.1.68 mysql.gdd        
	192.168.1.68 server.gdd           
	
1. 下载Git客户端并安装：
	* [点击下载](http://git.gdd:8889/root/gdd-doc/raw/70c3715100fe7e6c73368f8085694b5a89017e80/tools/git/Git-1.8.4-preview20130916.exe)
	* 安装时除以下步骤选择最后一个外，其他都可以默认。

	![](http://i.imgur.com/h2Hy7QV.png)

1. 安装后进行如下操作：
	* 在E盘或者F盘新建一个目录叫：gitlab
	* 右键gitlab目录，运行：Git Bash

	  ![](http://i.imgur.com/w4T6Nx8.png)

1. 在命令窗口分别执行以下命令：   
	注意：每个命令，一直回车即可。
	```
	git config --global user.name "<your username>"
	git config --global user.email "<your email>"
	ssh-keygen -t rsa -C "<your email>"
	```
1. 登录git网页版
	* 地址：[http://git.gdd:8889/](http://git.gdd:8889/)
	* 用户名：自己的英文名字
	* 默认密码：88888888
	* 点击右上角的用户头像，进入个人设置

	![](http://i.imgur.com/1nZ8Drr.png)

	* 点击左侧的：SSH Keys

	![](http://i.imgur.com/iPdTSSn.png)

	* 点击右侧的：Add SSH Key

	![](http://i.imgur.com/pRhcDaV.png)

	* 进入Add an SSH Key窗口

	![](http://i.imgur.com/GpZGbn5.png)

	* 用记事本打开文件：C:\Users\Administrator\.ssh\id_rsa.pub
	* 拷贝`id_rsa.pub`中的内容，到上面的窗口，并保存

至此，git的环境已经配置好，现在查看自己有哪些git仓库目录。

1. 在git的首页，能看到右侧有一些Project，这是你有权访问的一些项目。

	![](http://i.imgur.com/VbP836l.png)

1. 比如：点击`Administrator / gdd-doc` 进入这项目后，点击SSH,并复制URL`git@git.gdd:root/gdd-doc.git`

	![](http://i.imgur.com/Y1MzBbj.png)

1. 在刚才的Git Bash 窗口，执行如下命令并回车，开始下载`gdd-doc`的文件

	![](http://i.imgur.com/LEL4fq7.png)

	* 注意：第一次运行时，可能需要确认，直接输入：yes，回车即可。
1. 文件下载完成后，就可以看到所有的项目资料了。

到此为止，git的安装和初次使用就结束了，还要进行其他的学习和操作，可以参考本文档其他章节，后者以下文档：

* [git - Book](http://git-scm.com/book/zh/v1)
* [git - 简易指南](http://www.bootcss.com/p/git-guide/)
* [git - Pro GIT](http://iissnan.com/progit/)

## Git 常用命令

### 获取文件

1. `git clone url` 克隆一个仓库
1. `git fetch origin` 更新本地仓库文件跟远端一致
1. `git branch` 查看本地有哪些分支
1. `git branch -r` 查看远端有哪些分支
1. `git branch -a` 查看本地和远端所有分支
1. `git branch -D feature1` 删除本地分支`feature1`，远端仓库一般不建议删除（管理员除外）
1. `git checkout develop` 下载并切花到develop分支（如果develop分支本地已有，则直接切换过去）
1. `git checkout -b feature1` 以当前分支为准，创建一个新的分支，名字叫`feature1`，并切换到`feature1`分支
1. `git pull origin develop` 从远端develop分支更新内容到工作区


### 提交文件

1. `git status` 查看改动的文件(或者打开GUI查看)
1. `git add <file>` 提交文件
1. `git add -A` 提交改动的所有文件
1. `git commit -m 'comment'` 添加评论提交代码到本地仓库
1. `git push origin develop` 提交代码到develop分支（**注意：**前提示当前分支也是develop分支，保持一致。）

### 打标签

1. `git tag` 查看所有tag
1. `git tag tag1` 将当前分支的当前代码打一个标签，名称叫`tag1`
1. `git push origin tag1` 将打好的标签`tag1`提交到远端
1. `git checkout tag1` 临时切换到啊`tag1`标签上
1. `git checkout -b feature2 tag1` 从`tag1`标签上创建一个分支并`feature1`并切换到这个分支上

### 其它命令

1. `git merge --no-ff feature1` 当前分支合并`feature1`分支，**注意：** `--no-ff` 要加。
1. `git log` 查看提交日志，按：`q`退出
1. `git reset --hard 'hash'` 硬性回退到之前的一个版本。`hash`是每个版本有一个hash码。

## Git GUI工具

稍后补充

## 参考

1. 常用 Git 命令清单-阮一峰：http://www.ruanyifeng.com/blog/2015/12/git-cheat-sheet.html
1. 我的git笔记-颜海镜：http://yanhaijing.com/git/2014/11/01/my-git-note/

