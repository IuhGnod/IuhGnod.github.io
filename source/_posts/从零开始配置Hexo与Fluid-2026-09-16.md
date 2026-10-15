---
title: 从零开始配置 Hexo & Fluid
date: 2026-09-16 18:00:00
tags:
  - Hexo
  - Fluid
  - 静态博客
  - 建站
  - 前端配置
  - 写作工具
categories:
  - 工具与效率
excerpt: 从安装 Hexo 到使用 Fluid 主题完成本地写作、搜索、文章配置和 GitHub Pages 部署，记录这套博客的实际配置和常见问题。
index_img: /img/cover-board.jpg
top: true
toc: true
---

这篇文章记录「走线之间」的搭建过程。重点不在于把配置文件逐项抄一遍，而在于说明每个文件负责什么、哪些设置需要尽早确定，以及怎样从本地预览走到线上发布。

如果你第一次使用 Hexo，可以按文章顺序操作；如果已经有博客，也可以直接跳到配置、写作或部署章节查找对应内容。

## Hexo 和 Fluid 分别负责什么

Hexo 读取 Markdown 文章和站点配置，生成一组可以直接部署的 HTML、CSS、JavaScript 和图片文件。它不需要运行数据库，文章和配置都可以放在 Git 仓库里管理。

Fluid 是显示层，负责首页、文章页、归档、分类、标签、关于页、代码块、目录和深浅色模式。Hexo 决定“生成什么”，Fluid 决定“页面怎么呈现”。把这两层分开后，换主题不会影响文章，升级主题也不必重写站点内容。

## 环境准备

### 查看 Node.js 和 npm 版本

当前项目使用 Hexo 8.1.2，建议使用较新的长期维护版 Node.js。本文截图记录的环境是 Node.js 24.16.0 和 npm 11.13.0；你的版本可以不同，只要满足项目依赖的运行要求即可。

```bash
node -v
npm -v
```

![Node.js 与 npm 版本检查结果](./pic/nodejs-npm-version-check.png)

如果终端提示找不到 `node` 或 `npm`，先安装 Node.js，再重新打开终端。Windows 环境下，安装程序通常会自动把 Node.js 加入 PATH；如果当前窗口仍然找不到命令，关闭后重新打开 PowerShell。

### 初始化项目

可以使用 Hexo 命令行工具初始化新项目：

```bash
npm install -g hexo-cli
hexo init my-blog
cd my-blog
npm install
```

启动本地服务：

```bash
hexo server
```

浏览器打开 `http://localhost:4000/`。第一次启动时先确认默认页面能正常显示，再开始修改主题和站点配置。这样遇到问题时，能分清是环境问题还是配置问题。

## 先看懂项目目录

| 路径 | 用途 | 日常是否修改 |
| --- | --- | --- |
| `_config.yml` | 站点名称、作者、URL、语言、时区和部署设置 | 经常修改 |
| `_config.fluid.yml` | Fluid 主题的外观和功能设置 | 按需修改 |
| `source/_posts/` | 文章 Markdown 文件 | 经常修改 |
| `source/img/` | 全站图片资源 | 按需添加 |
| `source/_posts/文章名/` | 某篇文章的专属资源目录 | 按需添加 |
| `themes/fluid/` | 主题源码 | 尽量不要直接修改 |
| `scaffolds/` | 新文章和页面的模板 | 按需修改 |
| `public/` | Hexo 生成的静态文件 | 不要手工修改 |
| `.github/workflows/` | GitHub Actions 工作流 | 部署方式变化时修改 |
| `package.json` | 项目依赖和常用命令 | 安装插件时更新 |

`public/` 和 `db.json` 都是生成结果或缓存。真正应该提交到 Git 的是文章、配置、主题自定义资源和工作流文件。

![Hexo 博客项目目录关系图](./pic/project-structure.png)

## 为什么使用根目录的 Fluid 配置

Fluid 主题目录中也有一份 `_config.yml`。本项目把它复制到站点根目录，改名为 `_config.fluid.yml`，然后只修改根目录这一份。

```bash
cp themes/fluid/_config.yml _config.fluid.yml
```

这样做的原因很实际：主题升级时，`themes/fluid/` 可能被新的版本覆盖。如果把个人配置写进主题目录，升级后需要重新找回所有修改；根目录配置则可以独立保存和审查。

## 站点级配置 `_config.yml`

下面是本项目最需要确认的部分：

```yaml
title: 走线之间
subtitle: '电路 · 嵌入式 · 调试 · 工具'
description: '一个硬件工程师的技术与思考'
author: IuhGnod
language: zh-CN
timezone: Asia/Shanghai

url: https://iuhgnod.github.io
permalink: :year/:month/:day/:hour:minute:second/
theme: fluid
```

`url` 要填写最终访问地址，它会影响页面中的绝对链接、分享信息和后续搜索引擎配置。`timezone` 建议显式设置，否则本地时间和服务器时间可能导致文章日期显示不一致。

![站点配置、文章源码与发布结果的关系](./pic/config-publish-flow.png)

### 提前确定永久链接

本项目使用日期和时间生成文章地址，例如：

```text
/2026/09/16/180000/
```

这种方式不依赖中文标题，生成规则简单，也方便长期维护。永久链接一旦被分享或收录，就不要随意修改；如果确实要更换规则，应同时准备旧地址跳转方案。

## Fluid 主题配置

### 导航栏和首页

导航栏当前包含首页、归档、分类、标签、关于和友链。菜单项放在 `_config.fluid.yml` 的 `navbar.menu` 中，每一项包含显示名称、链接和图标。

首页主要调整以下内容：

```yaml
index:
  banner_img: /img/banner.jpg
  banner_img_height: 100
  banner_mask_alpha: 0.3
  slogan:
    enable: true
    text: "纸上得来终觉浅，绝知此事要躬行"
```

头图应该保证文字区域有足够的对比度。图片本身很亮时，可以适当提高 `banner_mask_alpha`；移动端还要检查主体是否被裁掉。

### 深浅色模式

```yaml
dark_mode:
  enable: true
  default: auto
```

`auto` 会优先跟随访客的系统偏好。自定义颜色时，浅色和深色配置要成对调整，否则正文、链接或代码块可能出现对比度不足的问题。

### 代码块、目录和图片

技术文章建议开启代码复制、语言标识和目录：

```yaml
code:
  copy_btn: true
  language:
    enable: true

post:
  toc:
    enable: true
  image_zoom:
    enable: true
```

代码块尽量标注语言，Shell 命令、YAML 和 JavaScript 不要混用同一种标识。文章中的图片可以放在全站 `source/img/` 下，也可以放在文章同名目录下。文章资源使用相对路径时，图片会跟随文章一起生成，适合管理截图和配图。

### 本地搜索

项目使用 Fluid 自带的搜索生成器生成索引，不需要额外安装 `hexo-generator-search`：

```yaml
search:
  enable: true
  path: /local-search.xml
  generate_path: /local-search.xml
  field: post
  content: true
```

如果以后更换搜索插件，要关闭 Fluid 自带的索引生成器，避免生成重复文件。部署后搜索不到新文章时，先执行 `hexo clean`，再重新生成站点。

## 创建和管理文章

新建文章：

```bash
hexo new post "文章标题"
```

文章开头的 Front-matter 决定标题、时间、分类、标签和首页展示方式：

```yaml
---
title: 文章标题
date: 2026-10-15 09:00:00
tags:
  - Hexo
categories:
  - 工具与效率
excerpt: 首页文章卡片显示的摘要
index_img: /img/cover-board.jpg
toc: true
---
```

分类用于组织文章的大方向，标签用于描述更具体的主题。建议先确定少量稳定分类，再用标签补充工具、器件、协议和问题类型，避免同一个概念出现多种写法。

启用文章资源目录后，可以把图片放到与文章同名的文件夹里：

```text
source/_posts/
└── 文章标题-2026-10-15.md
    └── pic/
        └── screenshot.png
```

文章中使用：

```markdown
![图片说明](./pic/screenshot.png)
```

替代文本要说明图片内容，不要保留软件自动生成的长串文件名。这样更容易维护，也能帮助无法加载图片的读者理解上下文。

![从 Markdown 写作到本地预览和静态发布的流程](./pic/writing-workflow.png)

## 本地开发和发布

修改文章或配置后，本地查看：

```bash
hexo clean
hexo server
```

准备发布时先生成静态文件：

```bash
npx hexo generate
```

本项目的正式部署由 `.github/workflows/deploy.yml` 完成。工作流会在 `main` 分支有新的推送，或手动触发时执行以下步骤：

1. 检出仓库源码。
2. 使用 Node.js 20 安装依赖。
3. 执行 `npm ci`，按 `package-lock.json` 安装固定版本。
4. 执行 `npx hexo generate` 生成 `public/`。
5. 将 `public/` 上传到 GitHub Pages 并部署。

因此，日常发布只需要提交源码并推送到 `main`。根配置中的 `hexo deploy` 仍可作为手动部署参考，但不要把它和 GitHub Actions 同时当作正式发布入口，否则容易混淆部署结果。

## 常见问题

### 修改配置后没有变化

先停止本地服务，再执行：

```bash
hexo clean
hexo server
```

如果线上没有变化，查看 GitHub Actions 的构建日志，确认提交进入了 `main`，并且 `npm ci` 和 Hexo 生成步骤都成功。

### 图片显示不出来

检查图片是否位于 `source/` 下，Markdown 路径是否与文件实际位置一致。文章专属图片使用 `./pic/文件名`，全站图片使用 `/img/文件名`。文件名大小写也要保持一致，Linux 构建环境会区分大小写。

### 线上样式或资源路径错误

检查 `_config.yml` 的 `url` 和 `root`。站点部署在域名根目录时，资源通常以 `/` 开头；如果部署在子路径下，需要按实际路径设置 `root`。

### 日期显示不正确

确认 `_config.yml` 中设置了 `timezone: Asia/Shanghai`，并在文章 Front-matter 中写出完整时间。不要只依赖文件名推断发布时间。

### 主题升级后配置丢失

确认修改的是根目录 `_config.fluid.yml`，而不是 `themes/fluid/_config.yml`。升级主题前可以先提交一次 Git，方便比较主题默认配置的变化。

## 上线前检查清单

- [ ] `title`、`description`、`author` 和 `url` 已改成真实信息。
- [ ] 首页、文章、关于、分类、标签、友链和 404 页面都能打开。
- [ ] 文章摘要、封面、分类和标签没有遗漏。
- [ ] 本地图片、代码块、目录和搜索功能正常。
- [ ] 手机宽度下头图、导航、表格和代码块可读。
- [ ] `npx hexo clean && npx hexo generate` 能够成功执行。
- [ ] GitHub Actions 构建完成，Pages 部署地址可访问。
- [ ] 页面中没有示例域名、默认备案号或临时占位文字。

## 写在最后

Hexo 的优点是把文章、配置和生成结果分开。写作时只需要维护 Markdown，发布时交给构建流程；遇到问题，就沿着“源文件、生成结果、部署日志”这条路径逐层检查。

先让站点稳定生成，再逐步调整配色、组件和交互。对于个人博客来说，持续写下真实问题，通常比一次性改完所有外观更重要。
