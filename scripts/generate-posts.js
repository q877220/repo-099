const axios = require('axios');
const fs = require('fs');
const path = require('path');
const yaml = require('yaml');
const slugify = require('slugify');
require('dotenv').config();

class AIBlogGenerator {
  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY;
    this.baseURL = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
    this.contentDir = path.join(__dirname, '../content/posts');
    
    if (!this.apiKey) {
      console.error('❌ 请在 .env 文件中设置 OPENAI_API_KEY');
      process.exit(1);
    }
  }

  // 获取热门技术话题
  getTechTopics() {
    const topics = process.env.TECH_TOPICS?.split(',') || [
      'JavaScript', 'Python', 'React', 'Vue', 'Node.js', 'TypeScript',
      'AI', '机器学习', '前端开发', '后端开发', 'DevOps', 'Docker',
      '微服务', '数据库', 'Redis', 'MongoDB', 'PostgreSQL', 'Kubernetes'
    ];
    return topics.map(topic => topic.trim());
  }

  // 获取教程类别
  getTutorialCategories() {
    const categories = process.env.TUTORIAL_CATEGORIES?.split(',') || [
      '入门教程', '进阶指南', '实战项目', '最佳实践', '性能优化', '架构设计'
    ];
    return categories.map(cat => cat.trim());
  }

  // 生成文章内容
  async generateArticle(type = 'tech', topic = null) {
    try {
      const prompt = this.createPrompt(type, topic);
      
      const response = await axios.post(
        `${this.baseURL}/chat/completions`,
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: '你是一个专业的技术博客作者，擅长写高质量的技术文章和教程。请用中文回答，确保内容专业、实用且易懂。'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 3000,
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error('❌ AI API 调用失败:', error.message);
      throw error;
    }
  }

  // 创建提示词
  createPrompt(type, topic) {
    const today = new Date().toLocaleDateString('zh-CN');
    
    if (type === 'tech') {
      const topics = this.getTechTopics();
      const selectedTopic = topic || topics[Math.floor(Math.random() * topics.length)];
      
      return `请写一篇关于 "${selectedTopic}" 的技术文章，要求：

1. 文章标题要吸引人且具有SEO价值
2. 内容包含：简介、核心概念、实际应用、代码示例、最佳实践、总结
3. 字数控制在 2000-3000 字
4. 包含实用的代码示例（如果适用）
5. 语言风格专业但易懂
6. 适合技术博客发布

请按以下格式返回：
TITLE: [文章标题]
SUMMARY: [文章摘要，1-2句话]
TAGS: [标签1,标签2,标签3] （3-5个标签）
CATEGORY: [分类]
CONTENT: [正文内容，使用Markdown格式]`;
    } else if (type === 'tutorial') {
      const categories = this.getTutorialCategories();
      const topics = this.getTechTopics();
      const selectedCategory = categories[Math.floor(Math.random() * categories.length)];
      const selectedTopic = topic || topics[Math.floor(Math.random() * topics.length)];
      
      return `请写一篇 "${selectedTopic}" 的 "${selectedCategory}" 文章，要求：

1. 标题明确指出这是教程类文章
2. 内容结构：前言、准备工作、分步教程、常见问题、总结
3. 包含详细的操作步骤和代码示例
4. 每个步骤都要有清晰的说明
5. 适合读者跟着实践
6. 字数控制在 2500-3500 字

请按以下格式返回：
TITLE: [教程标题]
SUMMARY: [教程摘要]
TAGS: [标签1,标签2,标签3] （3-5个标签）
CATEGORY: [教程]
CONTENT: [教程正文，使用Markdown格式，包含步骤编号]`;
    }

    return `请写一篇关于技术的博客文章，主题自选，要求专业且实用。`;
  }

  // 解析AI生成的内容
  parseAIResponse(content) {
    const lines = content.split('\n');
    const result = {
      title: '',
      summary: '',
      tags: [],
      category: '技术',
      content: ''
    };

    let contentStartIndex = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line.startsWith('TITLE:')) {
        result.title = line.replace('TITLE:', '').trim();
      } else if (line.startsWith('SUMMARY:')) {
        result.summary = line.replace('SUMMARY:', '').trim();
      } else if (line.startsWith('TAGS:')) {
        const tagString = line.replace('TAGS:', '').trim();
        result.tags = tagString.split(',').map(tag => tag.trim());
      } else if (line.startsWith('CATEGORY:')) {
        result.category = line.replace('CATEGORY:', '').trim();
      } else if (line.startsWith('CONTENT:')) {
        contentStartIndex = i + 1;
        break;
      }
    }

    // 提取正文内容
    if (contentStartIndex > 0) {
      result.content = lines.slice(contentStartIndex).join('\n').trim();
    } else {
      // 如果没有找到CONTENT标记，尝试从第一个#开始
      const firstHashIndex = lines.findIndex(line => line.startsWith('#'));
      if (firstHashIndex >= 0) {
        result.content = lines.slice(firstHashIndex).join('\n').trim();
      }
    }

    return result;
  }

  // 生成文件名slug
  generateSlug(title) {
    return slugify(title, {
      lower: true,
      strict: true,
      locale: 'zh'
    });
  }

  // 创建Hugo front matter
  createFrontMatter(data) {
    const now = new Date();
    const frontMatter = {
      title: data.title,
      date: now.toISOString(),
      draft: process.env.AUTO_PUBLISH === 'true' ? false : true,
      summary: data.summary,
      tags: data.tags,
      categories: [data.category],
      author: 'AI助手',
      autoGenerated: true
    };

    return `+++\n${Object.entries(frontMatter)
      .map(([key, value]) => {
        if (Array.isArray(value)) {
          return `${key} = [${value.map(v => `"${v}"`).join(', ')}]`;
        } else if (typeof value === 'boolean') {
          return `${key} = ${value}`;
        } else {
          return `${key} = "${value}"`;
        }
      })
      .join('\n')}\n+++\n\n`;
  }

  // 保存文章到文件
  async saveArticle(articleData) {
    const slug = this.generateSlug(articleData.title);
    const today = new Date().toISOString().split('T')[0];
    const filename = `${today}-${slug}.md`;
    const filepath = path.join(this.contentDir, filename);

    // 确保目录存在
    if (!fs.existsSync(this.contentDir)) {
      fs.mkdirSync(this.contentDir, { recursive: true });
    }

    const frontMatter = this.createFrontMatter(articleData);
    const fileContent = frontMatter + articleData.content;

    fs.writeFileSync(filepath, fileContent, 'utf-8');
    console.log(`✅ 文章已保存: ${filename}`);
    
    return filepath;
  }

  // 生成单篇文章
  async generateSinglePost(type = 'tech', topic = null) {
    console.log(`🤖 开始生成${type === 'tech' ? '技术' : '教程'}文章...`);
    
    try {
      const aiContent = await this.generateArticle(type, topic);
      const articleData = this.parseAIResponse(aiContent);
      
      if (!articleData.title || !articleData.content) {
        throw new Error('AI返回的内容格式不正确');
      }
      
      const filepath = await this.saveArticle(articleData);
      
      console.log(`📝 文章标题: ${articleData.title}`);
      console.log(`🏷️  标签: ${articleData.tags.join(', ')}`);
      console.log(`📁 分类: ${articleData.category}`);
      
      return filepath;
    } catch (error) {
      console.error('❌ 生成文章失败:', error.message);
      throw error;
    }
  }

  // 批量生成文章
  async generateMultiplePosts(count = 2) {
    console.log(`🚀 开始批量生成 ${count} 篇文章...`);
    
    const results = [];
    for (let i = 0; i < count; i++) {
      try {
        // 随机选择文章类型
        const type = Math.random() > 0.5 ? 'tech' : 'tutorial';
        const filepath = await this.generateSinglePost(type);
        results.push(filepath);
        
        // 添加延迟避免API限制
        if (i < count - 1) {
          console.log('⏳ 等待 2 秒...');
          await new Promise(resolve => setTimeout(resolve, 2000));
        }
      } catch (error) {
        console.error(`❌ 生成第 ${i + 1} 篇文章失败:`, error.message);
      }
    }
    
    console.log(`✨ 批量生成完成，成功生成 ${results.length} 篇文章`);
    return results;
  }
}

// 命令行接口
async function main() {
  const args = process.argv.slice(2);
  const generator = new AIBlogGenerator();
  
  let type = 'tech';
  let count = 1;
  let topic = null;
  
  // 解析命令行参数
  args.forEach(arg => {
    if (arg.startsWith('--type=')) {
      type = arg.split('=')[1];
    } else if (arg.startsWith('--count=')) {
      count = parseInt(arg.split('=')[1]);
    } else if (arg.startsWith('--topic=')) {
      topic = arg.split('=')[1];
    }
  });
  
  try {
    if (count > 1) {
      await generator.generateMultiplePosts(count);
    } else {
      await generator.generateSinglePost(type, topic);
    }
  } catch (error) {
    console.error('❌ 程序执行失败:', error.message);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

module.exports = AIBlogGenerator;
