---
title: 你好，Hexo
date: 2026-09-16 17:45:00
tags:
  - Hexo
  - 博客
categories:
  - 随笔
excerpt: 这是本站的第一篇文章，记录一下 Hexo + Fluid 博客的搭建过程。
top: true
toc: true
---

欢迎来到我的博客！🎉 这是使用 **Hexo + Fluid** 搭建的第一篇文章。

## 快速开始

### 写一篇新文章

```bash
hexo new "我的新文章"
```

文章文件会生成在 `source/_posts/` 目录下，使用 Markdown 编写。

### 启动本地服务

```bash
hexo server
```

打开 `http://localhost:4000` 即可实时预览。

### 生成静态文件

```bash
hexo generate
```

产物输出在 `public/` 目录，可直接部署到 GitHub Pages、Vercel、Nginx 等任意静态托管。

## 常用命令速查

| 命令 | 说明 |
| --- | --- |
| `hexo new "标题"` | 新建文章 |
| `hexo new page "名称"` | 新建页面 |
| `hexo clean` | 清理缓存与生成文件 |
| `hexo g` | 生成静态文件 |
| `hexo s` | 启动本地预览服务 |
| `hexo d` | 部署到远程 |

## 下一步

- 修改站点根目录下的 `_config.yml`（站点信息）
- 修改 `_config.fluid.yml`（主题外观）
- 把 `source/img/avatar.png` 换成你自己的头像

祝你写作愉快 ✍️
