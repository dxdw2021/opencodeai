#!/usr/bin/env node

// 专家集成脚本
// 将 experts/plugins 下的 agent md 文件复制到 .opencode/agent/ 目录
// 使 OpenCode 能够识别和加载这些专家

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EXPERTS_DIR = path.join(__dirname, 'experts');
const TARGET_DIR = path.join(__dirname, '.opencode', 'agent');

async function ensureDir(dir) {
  try {
    await fs.mkdir(dir, { recursive: true });
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }
}

async function copyExperts() {
  console.log('🚀 开始集成专家到 OpenCode...\n');
  
  // 确保目标目录存在
  await ensureDir(TARGET_DIR);
  
  // 读取 manifest.json
  const manifestPath = path.join(EXPERTS_DIR, 'manifest.json');
  let manifest;
  try {
    const content = await fs.readFile(manifestPath, 'utf-8');
    manifest = JSON.parse(content);
  } catch (err) {
    console.error('❌ 无法读取 manifest.json:', err.message);
    return;
  }
  
  const experts = manifest.experts || [];
  console.log(`📦 找到 ${experts.length} 个专家\n`);
  
  let copied = 0;
  let skipped = 0;
  let errors = 0;
  
  for (const expert of experts) {
    const { id, displayName, promptFile, agentName, expertType } = expert;
    
    // 只处理 agent 类型的专家
    if (expertType !== 'agent') {
      console.log(`⏭️  跳过 ${displayName?.zh || id} (类型: ${expertType})`);
      skipped++;
      continue;
    }
    
    // 检查是否有 promptFile
    if (!promptFile) {
      console.log(`⏭️  跳过 ${displayName?.zh || id} (无 promptFile)`);
      skipped++;
      continue;
    }
    
    // 构建源文件路径
    const sourcePath = path.join(EXPERTS_DIR, promptFile.startsWith('/') ? promptFile.slice(1) : promptFile);
    
    // 构建目标文件路径
    const targetFileName = `${agentName || id}.md`;
    const targetPath = path.join(TARGET_DIR, targetFileName);
    
    try {
      // 检查源文件是否存在
      await fs.access(sourcePath);
      
      // 复制文件
      await fs.copyFile(sourcePath, targetPath);
      console.log(`✅ ${displayName?.zh || id} -> ${targetFileName}`);
      copied++;
    } catch (err) {
      console.error(`❌ ${displayName?.zh || id}: ${err.message}`);
      errors++;
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log(`📊 集成结果:`);
  console.log(`   ✅ 成功: ${copied}`);
  console.log(`   ⏭️  跳过: ${skipped}`);
  console.log(`   ❌ 失败: ${errors}`);
  console.log('='.repeat(50));
  
  if (copied > 0) {
    console.log(`\n🎯 专家已集成到: ${TARGET_DIR}`);
    console.log('\n💡 使用方法:');
    console.log('   1. 在 OpenCode 中使用 /agent 命令查看可用专家');
    console.log('   2. 使用 /agent <专家名> 切换到指定专家');
    console.log('   3. 或者在 TUI 中按 Ctrl+A 打开 Agent 选择对话框');
  }
}

// 运行脚本
copyExperts().catch(console.error);