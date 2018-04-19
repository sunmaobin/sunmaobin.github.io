# iMAC新手上手指南

## 一、初识iMAC

### 1、C盘、D盘哪去了？

* `访达` 中的 `文稿` 对应Windows上的 `我的电脑`

* `启动台` 对应Windows上的 `所有程序`

* `系统偏好设置`  是Mac上设置所有选项的地方，相当于Windows上的 `控制面板` 等

  ![Imgur](https://i.imgur.com/xCbLjzi.png)

* 在 `文稿` 中新建几个根文件夹，然后可以作为Windows上的C盘、D盘之类的，可以右键文件夹，标记为不同的颜色，以后操作的时候，可以通过颜色快速定位到想要的目录，不必要从 `文稿` 一级一级往下翻

  <img src="https://i.imgur.com/zu6mO9x.png" width="400px">

### 2、APP顶部的菜单栏去哪了？

在Mac中，所有APP共享顶部的导航栏，在不同App中，顶部的导航栏显示当前App的导航栏。比如：

* 显示桌面的时候，顶部导航栏：

  <img src="https://i.imgur.com/PHZiUDA.png" width="400px">


* 在Webstorm编辑器中时，顶部导航栏：

  <img src="https://i.imgur.com/RtUXRch.png" width="400px">

## 二、项目工具类

###  1、SVN

* 安装路径：推荐使用SmartSVN，安装路径：[smb://192.168.2.114/常用软件/svn/macsvn/smartsvn_osx_win_8.6.zip](smb://192.168.2.114/常用软件/svn/macsvn/smartsvn_osx_win_8.6.zip)
* 破解：
  * 安装Java环境，[下载](http://download.oracle.com/otn-pub/java/jdk/8u162-b12/0da788060d494f5095bf8624735fa2f1/jdk-8u162-macosx-x64.dmg?AuthParam=1523157326_5d70cdeed8cb50e1e8acf10d167b1d51)

  * 解压上面的安装包，切换到破解目录：smartsvn_osx_8.6/keygen

  * 运行：keygen.sh，选择 `smartsvn` 随便输入用户名和邮箱，保存到一个本地目录

  * 打开SmartSVN，菜单：Help/Register，选择刚才保存的破解文件，重启即可
    <img src="https://i.imgur.com/054D0SY.png" width="400px">
    右键命令：
    <img src="https://i.imgur.com/pza8fF8.png" width="400px">


### 2、GIT

* 推荐使用IDE集成的GIT工具，如：`IDEA` `Webstorm` 或者 `Visual Studio` 的GIT插件，因为这些工具集成的插件，一般可视化效果比较好，比如：文件对比之类的。
* 或者使用 `smartgit` [https://www.syntevo.com/smartgit/](https://www.syntevo.com/smartgit/)，但是可能需要破解，破解可以直接使用上面SVN的破解工具，破解时选择 `smartgit` 破解即可，是一个公司出的。


### 3、Office软件


### 4、PS软件


## 三、装机常用软件

### 1、Axure 原型工具


### 2、VMWare 虚拟机

如果Windows虚拟机需要共享MAC的文件路径，则需要：

* 在此虚拟机设置中共享Mac文件夹，`系统设置` -> `共享`
* 在Windows虚拟机中安装 `Windows VMWare Tools `，安装完重启虚拟机即可

### 3、FileZilla FTP工具

### 4、其它

- 微信 - AppStore安装
- QQ（截图用） - AppStore安装
- Sougou输入法 - AppStore安装
- 有道翻译 - AppStore安装
- Dr.UnArchiver - 解压软件（zip/rar）- AppStore安装
- IINA - 视频播放软件（默认QuickTime不支持播放AVI格式）- [https://lhc70000.github.io/iina/zh-cn/](https://lhc70000.github.io/iina/zh-cn/)
- V消息 - [V消息网页版左侧最后一个菜单点击下载安装](http://vchat.file.vivo.xyz:8020/vivo/com.sie.mp.onlinechat.chatDesktop.flow)
- SwithHosts! - Host切换神器 - [http://oldj.github.io/SwitchHosts/](http://oldj.github.io/SwitchHosts/)
- Charles - 代理调试工具 - [https://www.charlesproxy.com/](https://www.charlesproxy.com/) - [在线破解](https://www.zzzmode.com/mytools/charles/)
- Brew - Mac上强大的命令行安装器 - [https://docs.brew.sh/](https://docs.brew.sh/)
- iTerm - 命令行工具比自带的Shell好用 - [https://www.iterm2.com/](https://www.iterm2.com/)
- Typora - Markdown编辑工具 - [https://typora.io/](https://typora.io/)
- ​

## 四、日常操作设置

### 1、打印机设置

系统偏好，打印机与扫描仪，点击 `+` 就可以扫描到网络打印机，点击确定即可添加。

<img src="https://i.imgur.com/iuctUnZ.png" width="800px">

### 2、远程电脑

#### # Windows -> Mac

Windows 和 Mac 上同时安装 `Teamview` 。

每次开会前，如果要远程主机的电脑，最好做如下的事情：

* 打开Mac上的Teamview，并拍照记下 `您的ID` 和 `密码`
* 在某个使用Windows电脑的同事机器上安装Teamview
* 远程时先通过会议室，远程同事Windows电脑，再通过同事的Teamview连接Mac的Teamview

> 以上要借用Windows电脑作为跳转，是公司会议室不允许安装Teamview。

#### # Mac -> Windows

安装软件：`Microsoft Remote Desktop`

#### # Mac -> Mac

在 `访达` 界面，按快捷键 `⌘ + K` ，地址栏输入：`vnc://172.25.122.86` 即可远程连接另一台Mac机器。

### 3、访问共享目录

打开 `访达` ，顶部菜单 `前往/连接服务器…` 或者执行快捷键 

`⌘ + K` 调出目录，输入共享目录地址，如：`smb://192.168.2.114` , 连接即可。

<img src="https://i.imgur.com/apzRhb6.png" width="400px">

### 4、切换输入法

* 任何App内使用快捷键：`⌃ + 空格`
* 鼠标点击右上角输入法图标，切换

### 5、快速访问桌面

* 使用快捷键：`⌘ + F3`
* 设置触发角，下文 `五-2`章节

## 五、高级操作

### 1、切换窗口

在Mac下切换窗口，通用的命令：`⌘+Tab ` ,但是这个命令有个缺陷，就是只能在不同的App直接切换。比如：Webstorm如果打开3个项目，其实就是同一个App打开了3个进程，这时候就不能切换。

如果要在这3个相同进程之间切换，如果不借助外力，目前我只找到如下两种切换方式：

* 在底部的Docker栏中，鼠标长按Webstorm的图标，然后切换：

  <img src="https://i.imgur.com/aAyksZa.png" width="300px">

* 在Webstorm中的 `窗口` 菜单中切换：

  <img src="https://i.imgur.com/VisjJNN.png" width="300px">


那么如何能快速切换组内窗口呢? 安装应用：`hyperswitch` - [https://bahoom.com/hyperswitch](https://bahoom.com/hyperswitch)

安装之后，可以设置组内应用切换的快捷键、全局应用切换快捷键，比如我个人设置如下：

* `⌥ + ~` 组内应用切换；
* `⌥ + TAB`  所有应用切换（包括组内和组外的所有窗口）

### 2、触发角

Mac屏幕的4个角，可以设置快捷方式，就是当鼠标放到4个角的时候触发的操作，个人觉得非常方便，我个人的设置如下：

<img src="https://i.imgur.com/xggvtyM.png" width="500px">

尤其是右上角的`启动屏幕保护程序`，每当我离开位置的时候，我顺手将鼠标挪到右上角，直接就进入屏保界面，同时配合从屏保唤醒桌面需要输入密码，简直比Windows上面的 `Windos + L` 还要方便。当然Mac上也有锁屏快捷键，即：

* `⌃ + ⌘ + Q` 进入屏保界面（这种方式情况下，屏幕马上就熄灭，进入睡眠状态，但是上面进入屏保界面不会）
* `⇧ + ⌘ + Q` 进入关机流程  

如何进入设置触发角？

`系统偏好` -> `桌面与屏幕保护程序` -> `触发角`

### 3、多个桌面切换

Mac允许设置多个桌面，每个桌面都可以打开多个APP，这样更有助于你归类开发，默认情况下是有2个：

* 仪表盘 - 有一些小工具在上面
* 桌面 - 默认的桌面

快速切换多个桌面，可以直接在鼠标上面2个或者3个指头同时左右滑动切换。

新增桌面，只需要打开 `调度中心` （快捷键 `F3` ）窗口，右上角点击 `+` 即可。

<img src="https://i.imgur.com/2P2jMOl.png" width="800px">