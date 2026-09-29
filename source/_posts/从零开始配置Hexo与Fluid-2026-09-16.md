---
title: 从零开始配置Hexo & Fluid
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
excerpt: 从安装 Hexo 到把 Fluid 主题调成自己想要的样子，记录一遍完整流程：目录结构、两套配置文件的职责划分、导航与首页、文章 front-matter、代码块与搜索、深浅色模式、部署上线，以及那些第一次一定会踩的坑。
index_img: /img/cover-board.jpg
top: true
toc: true
---

本站就是用 Hexo + Fluid 搭起来的。这篇把整套配置流程从头梳理一遍——不只是一份配置清单，更想讲清楚**每个开关背后的取舍**，以及我实际踩过的坑。

## Hexo + Fluid的优势

- **Hexo**：基于 Node.js，生成速度快，Markdown 直接写，不依赖数据库，产物是纯静态文件，扔到任何地方都能跑。
- **Fluid**：Material Design 风格，配置项丰富到几乎不用改代码，中文文档完整，且国内访问需要的字体、CDN 都已经处理好

一句话总结：**写的时候只管 Markdown，其余交给主题。**

## 一、环境准备与安装

需要 Node.js 18 以上版本。确认环境：

```bash
node -v
npm -v
```

![image-20260928160738077](./pic/image-20260928160738077.png)

然后全局安装 Hexo 命令行工具：

```bash
npm install -g hexo-cli
```

初始化博客（`my-blog` 换成你的目录名）：

```bash
hexo init my-blog
cd my-blog
npm install
```

此时直接 `hexo server` 就能在 `http://localhost:4000` 看到默认站点。**先跑起来，再动配置**——这是排查问题的基本前提。

## 二、目录结构：先搞清楚谁是谁

Hexo 的目录不算多，但第一次看容易晕：

| 路径 | 作用 | 要不要动 |
| --- | --- | --- |
| `_config.yml` | 站点级配置（标题、作者、URL、部署） | 必改 |
| `_config.fluid.yml` | 主题级配置（外观、功能、页面） | 必改 |
| `source/_posts/` | 文章 Markdown 文件 | 天天动 |
| `source/img/` | 图片资源 | 按需 |
| `themes/fluid/` | 主题源码 | **不要动** |
| `scaffolds/` | 新建文章的模板 | 可选 |
| `public/` | 生成的静态站点 | 自动生成，别手改 |
| `node_modules/` | 依赖 | 别动 |

### 关键点：为什么主题配置要放在根目录

主题目录 `themes/fluid/` 里本来也有一份 `_config.yml`。但我们**不直接改它**，而是把它复制到**站点根目录**，重命名为 `_config.fluid.yml`。

原因很简单：**升级主题时，`themes/fluid/` 会被整个覆盖，你的配置全没了。** 放在根目录的 `_config.fluid.yml` 不受影响，主题仍然会优先读取它。

```bash
# 主题配置放到站点根目录，升级主题不丢配置
cp themes/fluid/_config.yml _config.fluid.yml
```

> 这是我建议你做的**第一件事**，比改任何配置项都重要。

## 三、站点配置 `_config.yml`

打开根目录的 `_config.yml`，重点改这几处：

```yaml
# 站点信息
title: 走线之间
subtitle: '电路 · 嵌入式 · 调试 · 工具'
description: '一个硬件工程师的技术与思考'
author: IuhGnod
language: zh-CN
timezone: Asia/Shanghai

# 站点地址，务必改成真实地址
url: https://iuhgnod.github.io

# 文章永久链接格式
permalink: :year/:month/:day/:title/

# 主题
theme: fluid
```

几个容易忽略的点：

- **`url` 必须改**。它影响 RSS、站点地图、分享卡片里的链接，留成 `http://example.com` 会让这些功能全部失效
- **`language: zh-CN`** 不设的话，主题界面会显示英文
- **`timezone`** 建议显式写成 `Asia/Shanghai`，否则文章的日期在本地和服务器上可能不一致

### 关于永久链接（permalink）的坑

默认的 `:year/:month/:day/:title/` 在标题是中文时，URL 会被转义成一长串 `%E8%B5%B0%E7%BA%BF...`，既不美观也不利于分享。

两种改进思路：

```yaml
# 方案一：用创建时间做链接，天然唯一
permalink: :year/:month/:day/:hour:minute:second/

# 方案二：装 abbrlink 插件，生成短哈希
# npm install hexo-abbrlink --save
permalink: posts/:abbrlink/
```

**这个决定建议在写文章之前做**，因为一旦文章发布、被搜索引擎收录，再改链接会导致旧地址全部 404。

## 四、主题外观配置 `_config.fluid.yml`

文件很长（一千多行），但结构清晰。按功能分组看，重点就下面几块。

### 1. 代码块增强

对技术博客来说，代码块体验直接决定可读性：

```yaml
code:
  copy_btn: true          # 复制按钮，必开
  language:
    enable: true
    default: "TEXT"       # 未标注语言时显示的名称
  highlight:
    enable: true
    line_number: true     # 行号，贴长代码时有用
    lib: "highlightjs"
    highlightjs:
      style: "github gist"      # 浅色样式
      style_dark: "dark"        # 深色样式
```

`copy_btn` 建议常开——读者复制命令行片段时体验差别很大。

### 2. 首页与副标题

```yaml
index:
  banner_img: /img/banner.jpg
  banner_img_height: 100      # 头图占屏幕高度的百分比
  banner_mask_alpha: 0.3      # 蒙版不透明度，值越大字越清楚

  slogan:
    enable: true
    text: "纸上得来终觉浅，绝知此事要躬行"

  post_meta:
    date: true
    category: true
    tag: true
```

配合打字机效果：

```yaml
fun_features:
  typing:
    enable: true
    typeSpeed: 70      # 数字越大越慢
    cursorChar: "_"
    loop: false
    scope: []          # 留空表示全站生效
```

`slogan.text` 支持写成列表，会在每次刷新时随机取一行。

### 3. 导航栏与菜单

```yaml
navbar:
  blog_title: "走线之间"
  menu:
    - { key: "home", link: "/", icon: "iconfont icon-home-fill" }
    - { key: "archive", link: "/archives/", icon: "iconfont icon-archive-fill" }
    - { key: "category", link: "/categories/", icon: "iconfont icon-category-fill" }
    - { key: "tag", link: "/tags/", icon: "iconfont icon-tags-fill" }
    - { key: "about", link: "/about/", icon: "iconfont icon-user-fill" }
```

图标全部来自 [Fluid 图标库](https://hexo.fluid-dev.com/docs/icon/)，按 `iconfont icon-xxx` 的格式填 css class 即可。菜单项增减很自由，不需要的整行注释掉就行。

### 4. 深浅色模式

```yaml
dark_mode:
  enable: true
  default: auto    # auto | light | dark
```

选 `auto` 时，优先跟随访客的系统设置；系统没给偏好，就按访客本地时间 18:00 到次日 6:00 自动进深色。

主题配色在 `color:` 段统一管理，每项都有 `_dark` 后缀的深色版本。**改配色建议只动这里，不要直接改主题 CSS**，否则升级主题时又白干。

### 5. 本地搜索

```bash
npm install hexo-generator-search --save
```

```yaml
search:
  enable: true
  path: /local-search.xml
  generate_path: /local-search.xml
  field: post        # post | page | all
  content: true      # 是否扫描正文
```

**如果装了其他搜索插件，一定要把这里关掉**，否则会生成多份索引文件，白白增加体积。

### 6. 文章页的目录与版权

```yaml
post:
  toc:
    enable: true
    expand_all: true       # 进文章就展开全部目录
    placement: right
    collapseDepth: 0       # 0 表示全部折叠

  copyright:
    enable: true
    license: 'BY-NC-SA'    # 按需选择 CC 协议
```

`collapseDepth: 0` 表示目录默认全部收起，适合标题层级很多的文章；文章通常很短的话，`expand_all: true` 更省事。

## 五、文章怎么写：front-matter 速查

每篇文章开头的 `---` 之间就是 front-matter，几个高频字段：

```yaml
---
title: 文章标题
date: 2026-09-16 18:00:00
tags:
  - Hexo
  - Fluid
categories:
  - 工具与效率
excerpt: 首页卡片上显示的摘要
index_img: /img/cover-board.jpg
top: true        # 置顶
toc: true        # 显示右侧目录
---
```

对照效果记忆最快：

| 字段 | 作用位置 |
| --- | --- |
| `excerpt` | 首页文章卡片上的一段摘要 |
| `index_img` | 首页卡片的封面图 |
| `banner_img` | 文章页顶部大图 |
| `top` | 置顶，首页标题前会显示小图标 |
| `toc` | 是否生成右侧目录 |

> 想让文章显示在首页顶部，`top: true` 就够了，不用手动调整日期。

## 六、部署上线

生成静态文件：

```bash
hexo clean && hexo generate
```

产物在 `public/` 目录，把这个目录丢到任何静态托管都行。

Hexo 也提供一键部署，需要先装部署插件（以 Git 为例）：

```bash
npm install hexo-deployer-git --save
```

然后在 `_config.yml` 里配置：

```yaml
deploy:
  type: git
  repo: https://github.com/用户名/用户名.github.io.git
  branch: gh-pages
```

执行 `hexo deploy` 就会把产物推到指定分支。

> 如果你用 GitHub Actions 自动构建，这套 `deploy` 配置其实可以不用——**推送源码后由 Actions 自动生成并发布**，更省心。两种方式选一种即可，别同时用。

## 七、几个一定会踩的坑

**1. 改了配置没生效**
九成是缓存问题。按顺序执行：

```bash
hexo clean && hexo server
```

**2. 升级主题后配置全没了**
说明你改的是 `themes/fluid/_config.yml`。正确做法是改根目录的 `_config.fluid.yml`。

**3. 文章日期比实际早一天**
时区没配对。在 `_config.yml` 里补上 `timezone: Asia/Shanghai`。

**4. 图片显示不出来**
放 `source/img/` 下，用 `/img/xxx.jpg` 引用。注意路径是以 `source` 为根，不是以文章为根。

**5. 部署后样式错乱**
通常是 `url` 没改，或者站点部署在子路径下却没配 `root`。

## 写在最后

Hexo + Fluid 的组合，本质上是一套**约定优于配置**的方案：默认样子就挺好看，你只需要按自己的需要微调。

我的建议是按这个顺序推进——**先把站点跑起来并部署成功，再去调外观**。很多人卡在"配置好看再发布"，结果一直在本地折腾，反而迟迟没有上线。

至于配置项本身，不用背。把它当成一本字典，用到哪查到哪：`_config.fluid.yml` 里每个字段上方都有中文注释，官方文档也写得很全。

先写起来，比什么都重要。
