---
title:  Linux 常用命令
date:   20160526111044
categories: [技术]
tags: [linux]
---

Linux 常用命令，最实用的命令集锦。

## 常用命令
   * `ls -l | grep "^.json" |wc -l` 查看目录文件个数
   * `wc -l info.log` 统计文件行数
   * `ls -lh test.log` 查看文件大小
   * `nano -w` 比vi更好用些
     - `ctrl + o` 回车 保存
     - `ctrl + x` 退出
   * `grep abc jvm.log` 从jvm.log中查询abc
   * `grep -n abc jvm.log` 查看jvm.log中含有abc的个数
   * `tail -500f` 滚屏500行
   * `tail -n 500` 查询最后500行
   * `head -n 500` 查询开始500行
   * `du -lh` 查看目录大小

## 查看机器性能
   * `dstat -arlpim` 查看系统整体性能：磁盘、吞吐、内存、CPU等
   * `df -h` 查看磁盘容量
   * `du -h` 查看目录大小
   * `free` 查看整体容量
   * `top` 查看性能
   * `htop` 查看详细性能

## 文件 vi
   * `%s/find/replace/g` 替换文件中所有的find字符串为replace
   * `split -l 50` 拆分原始文件

## screen 启动后台进程
   * `screen 回车` 进入一个后台界面
   * `screen -S name` 创建一个名为name的screen
   * `screen -r night` 进入name为screen的窗口
   * `ctrl+A D` 退出当前screen
   * `screen -r` 查看所有screen
   * `screen -r pid` 进入某一个screen
   * `ctrl+Z` 结束当前screen
   * `screen -wipe` 检查目前所有的screen作业，并删除已经无法使用的screen作业
   * `ctrl+s` 锁屏
   * `ctrl+q` 解锁

## 压缩/解压命令
   * `unzip xxx.zip -d /home` 解压到指定目录home
   * `gzip -dc jvm-app-0.log.20141218.0506.gz | grep UnknownHostException` 查看压缩文件并且搜索关键字
   * `tar -czf file.tar /usr/local/..` 压缩
   * `tar –xvf file.tar`  解压 tar包
   * `tar -xzvf file.tar.gz` 解压tar.gz

## 删除所有的进程
   * `ps -ef |grep s3cmd |awk '{print $2}'|xargs kill -9`

## 远程传输
   * `dyscp 10.1.5.60 /data/py_overlord_data/td_11/ xa-02.log`
   * `dyscp 10.1.2.18 /dianyi/app/origin-1.13/ *`
   * `dyscp 10.1.5.60 /data/py_overlord_data/td_15/ *`

## 软连接
   * `ln -s a b` 创建软连接。a 就是源文件，b是链接文件名,其作用是当进入b目录，实际上是链接进入了a目录
   * `rm -rf  b` 删除软链接。注意不是 `rm -rf  b/`