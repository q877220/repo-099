const fs = require('fs');
const path = require('path');
const axios = require('axios');
require('dotenv').config();

class ConfigValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
  }

  // 验证环境变量
  validateEnvironment() {
    console.log('🔍 检查环境变量配置...');
    
    const requiredVars = ['OPENAI_API_KEY'];
    const optionalVars = ['OPENAI_BASE_URL', 'POSTS_PER_DAY', 'AUTO_PUBLISH'];
    
    requiredVars.forEach(varName => {
      if (!process.env[varName]) {
        this.errors.push(`❌ 缺少必需的环境变量: ${varName}`);
      } else {
        console.log(`✅ ${varName}: 已配置`);
      }
    });
    
    optionalVars.forEach(varName => {
      if (process.env[varName]) {
        console.log(`✅ ${varName}: ${process.env[varName]}`);
      } else {
        this.warnings.push(`⚠️  可选环境变量未配置: ${varName}`);
      }
    });
  }

  // 验证目录结构
  validateDirectoryStructure() {
    console.log('\n📁 检查目录结构...');
    
    const requiredDirs = [
      'content',
      'content/posts',
      'scripts',
      '.github',
      '.github/workflows'
    ];
    
    const requiredFiles = [
      'hugo.toml',
      'package.json',
      'scripts/generate-posts.js',
      'scripts/daily-generator.js',
      '.github/workflows/ai-generate.yml'
    ];
    
    requiredDirs.forEach(dir => {
      const dirPath = path.join(__dirname, '..', dir);
      if (fs.existsSync(dirPath)) {
        console.log(`✅ 目录存在: ${dir}`);
      } else {
        this.errors.push(`❌ 缺少目录: ${dir}`);
      }
    });
    
    requiredFiles.forEach(file => {
      const filePath = path.join(__dirname, '..', file);
      if (fs.existsSync(filePath)) {
        console.log(`✅ 文件存在: ${file}`);
      } else {
        this.errors.push(`❌ 缺少文件: ${file}`);
      }
    });
  }

  // 验证 AI API 连接
  async validateAPIConnection() {
    console.log('\n🤖 测试 AI API 连接...');
    
    if (!process.env.OPENAI_API_KEY) {
      this.errors.push('❌ 无法测试 API：缺少 API 密钥');
      return;
    }
    
    try {
      const baseURL = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1';
      
      const response = await axios.post(
        `${baseURL}/chat/completions`,
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'user',
              content: '你好，这是一个API连接测试。'
            }
          ],
          max_tokens: 50
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );
      
      if (response.data && response.data.choices) {
        console.log('✅ AI API 连接成功');
        console.log(`📊 模型响应: ${response.data.choices[0].message.content.substring(0, 50)}...`);
      }
    } catch (error) {
      if (error.response) {
        this.errors.push(`❌ API 调用失败: ${error.response.status} - ${error.response.data?.error?.message || 'Unknown error'}`);
      } else if (error.request) {
        this.errors.push('❌ 网络连接失败，请检查网络设置');
      } else {
        this.errors.push(`❌ API 配置错误: ${error.message}`);
      }
    }
  }

  // 验证 Hugo 配置
  validateHugoConfig() {
    console.log('\n📖 检查 Hugo 配置...');
    
    const hugoConfigPath = path.join(__dirname, '../hugo.toml');
    
    if (!fs.existsSync(hugoConfigPath)) {
      this.errors.push('❌ 缺少 hugo.toml 配置文件');
      return;
    }
    
    try {
      const configContent = fs.readFileSync(hugoConfigPath, 'utf-8');
      
      // 检查基本配置
      const requiredConfigs = [
        'baseURL',
        'title',
        'theme'
      ];
      
      requiredConfigs.forEach(config => {
        if (configContent.includes(config)) {
          console.log(`✅ Hugo 配置包含: ${config}`);
        } else {
          this.warnings.push(`⚠️  Hugo 配置可能缺少: ${config}`);
        }
      });
      
      // 检查主题
      if (configContent.includes('theme = "PaperMod"') || configContent.includes("theme = 'PaperMod'")) {
        const themePath = path.join(__dirname, '../themes/PaperMod');
        if (fs.existsSync(themePath)) {
          console.log('✅ PaperMod 主题已安装');
        } else {
          this.errors.push('❌ PaperMod 主题目录不存在');
        }
      }
      
    } catch (error) {
      this.errors.push(`❌ 读取 Hugo 配置失败: ${error.message}`);
    }
  }

  // 验证 Git 配置
  validateGitConfig() {
    console.log('\n🔗 检查 Git 配置...');
    
    const { execSync } = require('child_process');
    
    try {
      // 检查是否在 Git 仓库中
      execSync('git rev-parse --git-dir', { stdio: 'ignore' });
      console.log('✅ Git 仓库已初始化');
      
      // 检查用户配置
      try {
        const userName = execSync('git config user.name', { encoding: 'utf-8' }).trim();
        const userEmail = execSync('git config user.email', { encoding: 'utf-8' }).trim();
        console.log(`✅ Git 用户: ${userName} <${userEmail}>`);
      } catch {
        this.warnings.push('⚠️  Git 用户信息未配置');
      }
      
      // 检查远程仓库
      try {
        const remote = execSync('git remote get-url origin', { encoding: 'utf-8' }).trim();
        console.log(`✅ 远程仓库: ${remote}`);
      } catch {
        this.warnings.push('⚠️  Git 远程仓库未配置');
      }
      
    } catch {
      this.errors.push('❌ 当前目录不是 Git 仓库');
    }
  }

  // 生成配置报告
  generateReport() {
    console.log('\n📋 配置验证报告');
    console.log('='.repeat(50));
    
    if (this.errors.length === 0) {
      console.log('🎉 恭喜！所有必需配置都已正确设置');
    } else {
      console.log('\n❌ 发现以下错误，需要修复：');
      this.errors.forEach(error => console.log(`  ${error}`));
    }
    
    if (this.warnings.length > 0) {
      console.log('\n⚠️  以下警告可以忽略，但建议修复：');
      this.warnings.forEach(warning => console.log(`  ${warning}`));
    }
    
    console.log('\n📖 详细配置说明请参考: docs/AI_GENERATOR.md');
    
    if (this.errors.length === 0) {
      console.log('\n🚀 你现在可以开始生成文章了！');
      console.log('运行以下命令开始：');
      console.log('  npm run generate:tech    # 生成技术文章');
      console.log('  npm run generate:tutorial # 生成教程文章');
    }
    
    return this.errors.length === 0;
  }

  // 运行所有验证
  async runAllValidations() {
    console.log('🔍 开始配置验证...\n');
    
    this.validateEnvironment();
    this.validateDirectoryStructure();
    await this.validateAPIConnection();
    this.validateHugoConfig();
    this.validateGitConfig();
    
    return this.generateReport();
  }
}

// 主函数
async function main() {
  const validator = new ConfigValidator();
  
  try {
    const isValid = await validator.runAllValidations();
    process.exit(isValid ? 0 : 1);
  } catch (error) {
    console.error('❌ 验证过程中发生错误:', error.message);
    process.exit(1);
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  main();
}

module.exports = ConfigValidator;
