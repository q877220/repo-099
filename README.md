# 我的 Hugo 博客

一个使用 Hugo 和 PaperMod 主题构建的现代化静态博客。

## 🤖 AI 自动内容生成

本博客集成了 AI 自动文章生成系统，可以：

- 🔄 **定时自动生成**技术文章和教程
- 📝 **智能内容创作**，覆盖前端、后端、AI、DevOps 等热门话题
- 🏷️ **自动分类标记**，SEO 优化
- 🚀 **一键部署**，生成后自动发布

### 快速开始

1. **配置 AI API**：
```bash
# 复制环境变量模板
cp .env.example .env

# 编辑 .env 文件，设置你的 API 密钥
# OPENAI_API_KEY=your_api_key_here
```

2. **验证配置**：
```bash
node scripts/validate-config.js
```

3. **生成文章**：
```bash
# 生成技术文章
npm run generate:tech

# 生成教程文章  
npm run generate:tutorial

# 启动定时服务
npm run generate:daily -- --start
```

详细使用说明请查看：[AI 生成系统文档](docs/AI_GENERATOR.md)

## 🚀 特性

- ⚡ 极快的加载速度（基于 Hugo）
- 🎨 现代化设计（PaperMod 主题）
- 📱 响应式布局
- 🔍 搜索功能
- 🌙 深色/浅色主题切换
- 📊 代码语法高亮
- 📈 SEO 优化
- 🏷️ 标签和分类系统
- 📖 阅读时间估算
- 🔗 社交分享按钮

## 🛠️ 技术栈

- **框架**: [Hugo](https://gohugo.io/) - 世界上最快的静态网站生成器
- **主题**: [PaperMod](https://github.com/adityatelange/hugo-PaperMod) - 简洁现代的 Hugo 主题
- **部署**: 支持 GitHub Pages、Netlify、Vercel

## 📝 本地开发

### 前置要求

- [Hugo Extended](https://gohugo.io/installation/) (v0.148.1+)
- [Git](https://git-scm.com/)

### 安装步骤

1. 克隆仓库
```bash
git clone <your-repo-url>
cd <your-repo-name>
```

2. 更新子模块（主题）
```bash
git submodule update --init --recursive
```

3. 启动开发服务器
```bash
hugo server --buildDrafts
```

4. 在浏览器中访问 http://localhost:1313

## ✍️ 创建内容

### 创建新文章

```bash
hugo new content posts/your-post-title.md
```

### 文章前置元数据示例

```yaml
+++
date = '2025-07-17T10:00:00+08:00'
draft = false
title = '你的文章标题'
summary = '文章摘要'
tags = ['标签1', '标签2']
categories = ['分类']
+++
```

### 目录结构

```
content/
├── posts/          # 博客文章
├── about.md         # 关于页面
└── ...             # 其他页面

static/             # 静态资源
├── images/         # 图片文件
└── ...

themes/PaperMod/    # 主题文件（不要直接修改）
```

## 🚀 部署

本博客支持多种免费托管平台：

### GitHub Pages

1. 推送代码到 GitHub 仓库
2. 在仓库设置中启用 GitHub Pages
3. 选择 "GitHub Actions" 作为源
4. GitHub Actions 会自动部署

### Netlify

1. 连接 GitHub 仓库到 Netlify
2. 构建设置会自动从 `netlify.toml` 读取
3. 每次推送时自动部署

### Vercel

1. 导入 GitHub 仓库到 Vercel
2. Vercel 会自动检测为 Hugo 项目
3. 使用 `vercel.json` 中的配置

## ⚙️ 配置

主要配置文件是 `hugo.toml`，你可以在其中自定义：

- 网站信息（标题、描述等）
- 主题参数
- 菜单导航
- 社交链接
- SEO 设置

## 📁 项目结构

```
.
├── .github/
│   ├── workflows/
│   │   └── hugo.yml        # GitHub Actions 工作流
│   └── copilot-instructions.md
├── content/
│   ├── posts/              # 博客文章
│   └── about.md            # 关于页面
├── static/                 # 静态资源
├── themes/
│   └── PaperMod/          # 主题（git 子模块）
├── hugo.toml              # Hugo 配置文件
├── netlify.toml           # Netlify 部署配置
├── vercel.json            # Vercel 部署配置
└── README.md              # 项目说明
```

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

本项目采用 MIT 许可证。详见 [LICENSE](LICENSE) 文件。

## 🙏 致谢

- [Hugo](https://gohugo.io/) - 静态网站生成器
- [PaperMod](https://github.com/adityatelange/hugo-PaperMod) - 博客主题

---

⭐ 如果这个项目对你有帮助，请给它一个星标！
