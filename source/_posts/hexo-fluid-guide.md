---
title: Hexo Fluid 主题配置笔记
date: 2026-09-16 18:00:00
tags:
  - Hexo
  - Fluid
  - 前端
categories:
  - 技术
excerpt: 整理 Fluid 主题中比较常用的配置项，方便日后查阅。
toc: true
---

Fluid 是 Hexo 上一款优秀的 Material Design 风格主题。本文记录一些常用配置。

## 配置文件说明

| 文件 | 作用 |
| --- | --- |
| `_config.yml` | Hexo 站点配置 |
| `_config.fluid.yml` | Fluid 主题配置（从主题目录复制而来） |

> 主题配置放在站点根目录，升级主题时不会被覆盖，非常方便。

## 导航栏

```yaml
navbar:
  blog_title: "我的博客"
  menu:
    - { key: "home", link: "/", icon: "iconfont icon-home-fill" }
    - { key: "archive", link: "/archives/", icon: "iconfont icon-archive-fill" }
```

图标可以从 [Fluid 图标库](https://hexo.fluid-dev.com/docs/icon/) 中挑选。

## 首页 Slogan

```yaml
index:
  slogan:
    enable: true
    text: "记录生活 · 沉淀技术 · 分享热爱"
```

配合 `fun_features.typing` 可以实现打字机效果。

## 文章置顶

在文章 front-matter 中加入：

```yaml
top: true
```

## 文章头图

```yaml
index_img: /img/cover.jpg
banner_img: /img/cover.jpg
```

`index_img` 用于首页卡片，`banner_img` 用于文章页顶部大图。

## 开启本地搜索

安装插件：

```bash
npm install hexo-generator-search --save
```

然后确保主题配置中：

```yaml
search:
  enable: true
  path: /local-search.xml
  field: post
  content: true
```

## 深色模式

```yaml
dark_mode:
  enable: true
  default: auto
```

`auto` 会优先跟随系统设置，其次按本地时间 18:00 - 次日 6:00 进入暗色。

## 更多

完整文档见 [Fluid 官方配置指南](https://hexo.fluid-dev.com/docs/guide/)。
