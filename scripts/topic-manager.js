const fs = require('fs');
const path = require('path');

class TopicManager {
  constructor() {
    this.topicsFile = path.join(__dirname, 'topics.json');
    this.loadTopics();
  }

  // 加载话题配置
  loadTopics() {
    if (fs.existsSync(this.topicsFile)) {
      this.topics = JSON.parse(fs.readFileSync(this.topicsFile, 'utf-8'));
    } else {
      this.topics = this.getDefaultTopics();
      this.saveTopics();
    }
  }

  // 保存话题配置
  saveTopics() {
    fs.writeFileSync(this.topicsFile, JSON.stringify(this.topics, null, 2));
  }

  // 默认话题配置
  getDefaultTopics() {
    return {
      tech: {
        frontend: [
          'React 18 新特性详解',
          'Vue 3 Composition API 最佳实践',
          'TypeScript 高级类型技巧',
          'Webpack 5 配置优化指南',
          'CSS-in-JS 解决方案对比',
          'Web Components 实战应用',
          'PWA 开发完整指南',
          '微前端架构设计与实现',
          'Vite 构建工具深度解析',
          'Next.js 13 新特性体验'
        ],
        backend: [
          'Node.js 性能优化实践',
          'Express.js 中间件设计模式',
          'GraphQL API 设计最佳实践',
          'Docker 容器化部署指南',
          'Redis 缓存策略与实现',
          'MongoDB 数据建模技巧',
          'JWT 认证与授权机制',
          'Serverless 架构设计',
          'API 网关设计模式',
          '微服务治理实践'
        ],
        ai: [
          'ChatGPT API 集成开发',
          '机器学习模型部署实战',
          'Transformer 模型原理解析',
          'AI 代码生成工具对比',
          '自然语言处理实战项目',
          '计算机视觉应用开发',
          'TensorFlow.js 浏览器端AI',
          'AI 伦理与安全考量',
          'Prompt Engineering 技巧',
          'AI 辅助软件开发'
        ],
        devops: [
          'CI/CD 流水线设计',
          'Kubernetes 集群管理',
          '监控系统搭建指南',
          '容器安全最佳实践',
          '基础设施即代码实践',
          '日志管理与分析',
          '性能测试与优化',
          '自动化部署策略',
          '云原生应用开发',
          '灾难恢复方案设计'
        ]
      },
      tutorials: {
        beginner: [
          'Git 版本控制入门教程',
          'HTML5 语义化标签指南',
          'CSS Flexbox 布局教程',
          'JavaScript 基础语法详解',
          'HTTP 协议基础知识',
          'SQL 数据库查询入门',
          'Linux 命令行基础',
          'API 调用入门指南',
          'JSON 数据格式详解',
          'Web 安全基础知识'
        ],
        intermediate: [
          '使用 React Hooks 构建应用',
          'Node.js 项目结构设计',
          'RESTful API 设计规范',
          'webpack 打包优化技巧',
          'CSS 预处理器使用指南',
          'Jest 单元测试实战',
          'Socket.io 实时通信',
          'Express.js 路由设计',
          'MongoDB 聚合查询',
          'Redis 数据结构应用'
        ],
        advanced: [
          '设计模式在前端中的应用',
          '分布式系统设计原理',
          '高并发架构设计实践',
          '性能监控与调优',
          '代码质量与重构技巧',
          '架构模式选择指南',
          '缓存策略设计',
          '数据库优化技巧',
          '安全防护最佳实践',
          '团队协作工具选择'
        ]
      },
      trending: [
        'Web3 开发入门',
        'ChatGPT 插件开发',
        'Rust 语言学习路径',
        'Deno 运行时探索',
        'WebAssembly 应用实战',
        'Flutter 跨平台开发',
        'SwiftUI 界面设计',
        'Kotlin 协程编程',
        'Go 语言微服务',
        'Python 数据分析'
      ]
    };
  }

  // 获取随机话题
  getRandomTopic(category = null) {
    if (category) {
      const categoryTopics = this.topics[category];
      if (!categoryTopics) return null;
      
      if (Array.isArray(categoryTopics)) {
        return categoryTopics[Math.floor(Math.random() * categoryTopics.length)];
      } else {
        // 如果是对象，随机选择一个子分类
        const subCategories = Object.keys(categoryTopics);
        const randomSubCategory = subCategories[Math.floor(Math.random() * subCategories.length)];
        const topics = categoryTopics[randomSubCategory];
        return topics[Math.floor(Math.random() * topics.length)];
      }
    }
    
    // 从所有话题中随机选择
    const allTopics = [];
    Object.values(this.topics).forEach(category => {
      if (Array.isArray(category)) {
        allTopics.push(...category);
      } else {
        Object.values(category).forEach(subCategory => {
          allTopics.push(...subCategory);
        });
      }
    });
    
    return allTopics[Math.floor(Math.random() * allTopics.length)];
  }

  // 获取特定分类的话题
  getTopicsByCategory(category, subCategory = null) {
    const categoryTopics = this.topics[category];
    if (!categoryTopics) return [];
    
    if (subCategory) {
      return categoryTopics[subCategory] || [];
    }
    
    if (Array.isArray(categoryTopics)) {
      return categoryTopics;
    } else {
      const allTopics = [];
      Object.values(categoryTopics).forEach(topics => {
        allTopics.push(...topics);
      });
      return allTopics;
    }
  }

  // 添加新话题
  addTopic(category, topic, subCategory = null) {
    if (!this.topics[category]) {
      this.topics[category] = subCategory ? {} : [];
    }
    
    if (subCategory) {
      if (!this.topics[category][subCategory]) {
        this.topics[category][subCategory] = [];
      }
      this.topics[category][subCategory].push(topic);
    } else {
      if (Array.isArray(this.topics[category])) {
        this.topics[category].push(topic);
      }
    }
    
    this.saveTopics();
    console.log(`✅ 话题已添加: ${topic}`);
  }

  // 列出所有话题
  listAllTopics() {
    console.log('📋 所有可用话题:');
    Object.entries(this.topics).forEach(([category, topics]) => {
      console.log(`\n🏷️  ${category.toUpperCase()}:`);
      
      if (Array.isArray(topics)) {
        topics.forEach((topic, index) => {
          console.log(`  ${index + 1}. ${topic}`);
        });
      } else {
        Object.entries(topics).forEach(([subCategory, subTopics]) => {
          console.log(`  📂 ${subCategory}:`);
          subTopics.forEach((topic, index) => {
            console.log(`    ${index + 1}. ${topic}`);
          });
        });
      }
    });
  }
}

// 命令行接口
function main() {
  const manager = new TopicManager();
  const args = process.argv.slice(2);
  
  if (args.includes('--list')) {
    manager.listAllTopics();
  } else if (args.includes('--random')) {
    const category = args.find(arg => arg.startsWith('--category='))?.split('=')[1];
    const topic = manager.getRandomTopic(category);
    console.log(`🎲 随机话题: ${topic}`);
  } else if (args.includes('--add')) {
    const category = args.find(arg => arg.startsWith('--category='))?.split('=')[1];
    const subCategory = args.find(arg => arg.startsWith('--subcategory='))?.split('=')[1];
    const topic = args.find(arg => arg.startsWith('--topic='))?.split('=')[1];
    
    if (category && topic) {
      manager.addTopic(category, topic, subCategory);
    } else {
      console.log('❌ 请提供 --category 和 --topic 参数');
    }
  } else {
    console.log(`
话题管理工具

用法:
  node topic-manager.js --list                               # 列出所有话题
  node topic-manager.js --random                             # 获取随机话题
  node topic-manager.js --random --category=tech             # 获取指定分类的随机话题
  node topic-manager.js --add --category=tech --topic="新话题"  # 添加新话题

示例:
  node topic-manager.js --add --category=tech --subcategory=frontend --topic="React Server Components"
`);
  }
}

if (require.main === module) {
  main();
}

module.exports = TopicManager;
