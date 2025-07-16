+++
date = '2025-07-17T01:20:00+08:00'
draft = false
title = 'Hugo 静态博客快速入门指南'
summary = '详细介绍如何使用 Hugo 创建静态博客，包括安装、配置和部署。'
tags = ['Hugo', '教程', '静态博客', 'Web开发']
categories = ['技术']
+++

# Hugo 静态博客快速入门指南

Hugo 是世界上最快的静态网站生成器之一，用 Go 语言编写。本文将带你从零开始创建一个 Hugo 博客。

## 为什么选择 Hugo？

### 优势

- ⚡ **极快的构建速度** - 几毫秒内生成网站
- 🎯 **简单易用** - 学习曲线平缓
- 🎨 **主题丰富** - 数百个免费主题可选
- 📦 **单文件部署** - 无需数据库或复杂依赖
- 🔧 **灵活配置** - 支持多种内容格式

## 安装 Hugo

### Windows

```powershell
# 使用 winget
winget install Hugo.Hugo.Extended

# 或使用 chocolatey
choco install hugo-extended
```

### macOS

```bash
# 使用 Homebrew
brew install hugo
```

### Linux

```bash
# Ubuntu/Debian
sudo apt install hugo

# Arch Linux
sudo pacman -S hugo
```

## 创建新站点

```bash
# 创建新站点
hugo new site myblog

# 进入目录
cd myblog

# 初始化 Git
git init
```

## 安装主题

```bash
# 添加 PaperMod 主题
git submodule add --depth=1 https://github.com/adityatelange/hugo-PaperMod.git themes/PaperMod
```

## 基本配置

在 `hugo.toml` 中配置你的网站：

```toml
baseURL = 'https://yourdomain.com'
languageCode = 'zh-cn'
title = '我的博客'
theme = 'PaperMod'

[params]
  ShowReadingTime = true
  ShowShareButtons = true
  ShowBreadCrumbs = true
```

## 创建内容

```bash
# 创建新文章
hugo new content posts/my-first-post.md
```

## 本地预览

```bash
# 启动开发服务器
hugo server --buildDrafts
```

然后在浏览器中访问 `http://localhost:1313`

## 部署选项

### GitHub Pages

1. 推送代码到 GitHub 仓库
2. 启用 GitHub Actions
3. 使用官方 Hugo 部署工作流

### Netlify

1. 连接 GitHub 仓库
2. 设置构建命令：`hugo`
3. 发布目录：`public`

### Vercel

1. 导入 GitHub 仓库
2. Vercel 会自动检测 Hugo 项目
3. 一键部署

## 小贴士

- 使用 `draft: false` 发布文章
- 定期备份你的内容
- 优化图片以提升加载速度
- 使用合适的标签和分类

## 总结

Hugo 是一个功能强大且易用的静态网站生成器，非常适合个人博客、技术文档和企业网站。凭借其出色的性能和丰富的生态系统，Hugo 是现代网站开发的优秀选择。

开始你的 Hugo 之旅吧！🚀ate = '2025-07-17T01:17:46+08:00'
draft = true
title = 'Hugo Getting Started'
+++
