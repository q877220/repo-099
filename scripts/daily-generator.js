const cron = require('node-cron');
const { execSync } = require('child_process');
const AIBlogGenerator = require('./generate-posts');
require('dotenv').config();

class DailyGenerator {
  constructor() {
    this.generator = new AIBlogGenerator();
    this.postsPerDay = parseInt(process.env.POSTS_PER_DAY) || 2;
    this.autoCommit = process.env.GITHUB_TOKEN && process.env.GITHUB_REPO;
  }

  // 自动提交到GitHub
  async commitToGithub(files) {
    if (!this.autoCommit) {
      console.log('📋 跳过自动提交（未配置GitHub token）');
      return;
    }

    try {
      console.log('📤 开始自动提交到GitHub...');
      
      // 添加新文件
      execSync('git add content/posts/', { stdio: 'inherit' });
      
      // 提交
      const message = `🤖 AI自动生成 ${files.length} 篇文章 - ${new Date().toLocaleDateString('zh-CN')}`;
      execSync(`git commit -m "${message}"`, { stdio: 'inherit' });
      
      // 推送
      execSync('git push origin main', { stdio: 'inherit' });
      
      console.log('✅ 自动提交完成');
    } catch (error) {
      console.error('❌ 自动提交失败:', error.message);
    }
  }

  // 每日生成任务
  async dailyGeneration() {
    console.log(`\n🌅 开始每日文章生成任务 - ${new Date().toLocaleString('zh-CN')}`);
    console.log(`📊 计划生成 ${this.postsPerDay} 篇文章`);
    
    try {
      const files = await this.generator.generateMultiplePosts(this.postsPerDay);
      
      if (files.length > 0 && this.autoCommit) {
        await this.commitToGithub(files);
      }
      
      console.log(`🎉 每日任务完成！生成了 ${files.length} 篇文章`);
    } catch (error) {
      console.error('❌ 每日生成任务失败:', error.message);
    }
  }

  // 启动定时任务
  startScheduler() {
    console.log('🚀 启动AI博客自动生成服务...');
    console.log(`⏰ 每日生成时间: 上午9:00`);
    console.log(`📝 每日文章数量: ${this.postsPerDay}`);
    console.log(`🔄 自动提交: ${this.autoCommit ? '已启用' : '未启用'}`);
    
    // 每天上午9点执行
    cron.schedule('0 9 * * *', () => {
      this.dailyGeneration();
    }, {
      scheduled: true,
      timezone: "Asia/Shanghai"
    });

    // 每周一额外生成教程文章
    cron.schedule('0 10 * * 1', async () => {
      console.log('📚 周一特别任务：生成教程文章');
      try {
        await this.generator.generateSinglePost('tutorial');
        console.log('✅ 周一教程文章生成完成');
      } catch (error) {
        console.error('❌ 周一教程生成失败:', error.message);
      }
    }, {
      scheduled: true,
      timezone: "Asia/Shanghai"
    });

    console.log('✅ 定时任务已启动，服务正在运行...');
    console.log('按 Ctrl+C 停止服务');
    
    // 保持进程运行
    process.on('SIGINT', () => {
      console.log('\n👋 停止AI博客生成服务...');
      process.exit(0);
    });
  }

  // 立即执行一次测试
  async testRun() {
    console.log('🧪 执行测试运行...');
    await this.dailyGeneration();
  }
}

// 命令行接口
async function main() {
  const scheduler = new DailyGenerator();
  
  const args = process.argv.slice(2);
  
  if (args.includes('--test')) {
    await scheduler.testRun();
  } else if (args.includes('--start')) {
    scheduler.startScheduler();
  } else {
    console.log(`
AI博客自动生成服务

用法:
  node daily-generator.js --start    # 启动定时服务
  node daily-generator.js --test     # 立即测试运行

配置:
  编辑 .env 文件设置API密钥和生成参数
`);
  }
}

if (require.main === module) {
  main();
}

module.exports = DailyGenerator;
