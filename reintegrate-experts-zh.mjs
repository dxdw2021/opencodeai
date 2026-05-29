#!/usr/bin/env node

// 专家集成脚本（中文版本）
// 将 experts/plugins 下的 agent md 文件复制到 .opencode/agent/ 目录
// 使用 profession.zh 作为显示名称（如"高级项目经理"）

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EXPERTS_DIR = path.join(__dirname, 'experts');
const AGENT_DIR = path.join(__dirname, '.opencode', 'agent');
const MANIFEST_PATH = path.join(EXPERTS_DIR, 'manifest.json');

// 颜色名称到十六进制的映射
const COLOR_MAP = {
  'red': '#ef4444',
  'orange': '#f97316',
  'amber': '#f59e0b',
  'yellow': '#eab308',
  'lime': '#84cc16',
  'green': '#22c55e',
  'emerald': '#10b981',
  'teal': '#14b8a6',
  'cyan': '#06b6d4',
  'sky': '#0ea5e9',
  'blue': '#3b82f6',
  'indigo': '#6366f1',
  'violet': '#8b5cf6',
  'purple': '#a855f7',
  'fuchsia': '#d946ef',
  'pink': '#ec4899',
  'rose': '#f43f5e',
  'gray': '#6b7280',
  'slate': '#64748b',
  'zinc': '#71717a',
  'neutral': '#737373',
  'stone': '#78716c',
  'gold': '#FFD700',
  'metallic-blue': '#4A90D9',
  'neon-cyan': '#00FFFF',
  'neon-green': '#39FF14',
};

async function main() {
  console.log('🚀 开始集成专家（中文版本）...\n');
  
  // 确保目标目录存在
  await fs.mkdir(AGENT_DIR, { recursive: true });
  
  // 读取 manifest.json
  const manifestContent = await fs.readFile(MANIFEST_PATH, 'utf-8');
  const manifest = JSON.parse(manifestContent);
  
  let integrated = 0;
  let skipped = 0;
  let errors = 0;
  
  // 处理每个专家
  for (const expert of manifest.experts) {
    const { id, displayName, profession, description, promptFile, expertType, agentName } = expert;
    
    // 只处理 agent 类型的专家
    if (expertType !== 'agent') {
      console.log(`⏭️  跳过 ${profession?.zh || displayName?.zh || id} (类型: ${expertType})`);
      skipped++;
      continue;
    }
    
    // 检查是否有 promptFile
    if (!promptFile) {
      console.log(`⏭️  跳过 ${profession?.zh || displayName?.zh || id} (无 promptFile)`);
      skipped++;
      continue;
    }
    
    // 构建源文件路径
    const sourcePath = path.join(EXPERTS_DIR, promptFile.startsWith('/') ? promptFile.slice(1) : promptFile);
    
    try {
      // 检查源文件是否存在
      await fs.access(sourcePath);
      
      // 读取源文件内容
      const content = await fs.readFile(sourcePath, 'utf-8');
      
      // 解析 frontmatter
      const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
      if (!frontmatterMatch) {
        console.log(`❌ ${profession?.zh || displayName?.zh || id}: 无效的文件格式`);
        errors++;
        continue;
      }
      
      const [, frontmatter, body] = frontmatterMatch;
      
      // 解析原始 frontmatter
      const origData = {};
      frontmatter.split('\n').forEach(line => {
        // 跳过空行
        if (!line.trim()) return;
        
        const match = line.match(/^(\w+):\s*(.+)$/);
        if (match) {
          const [, key, value] = match;
          // 处理颜色字段
          if (key === 'color') {
            const cleanValue = value.replace(/^["']|["']$/g, '');
            // 如果是颜色名称，转换为十六进制
            if (COLOR_MAP[cleanValue]) {
              origData[key] = COLOR_MAP[cleanValue];
            } else if (/^#[0-9a-fA-F]{6}$/.test(cleanValue)) {
              origData[key] = cleanValue;
            } else {
              // 跳过无效的颜色值，不设置这个字段
              console.log(`⚠️  跳过无效颜色: ${cleanValue}`);
            }
          } else {
            origData[key] = value.replace(/^["']|["']$/g, '');
          }
        }
      });
      
      // 构建中文名称 - 使用 profession.zh 作为显示名称
      const zhName = profession?.zh || displayName?.zh || agentName || id.toLowerCase();
      
      // 构建中文描述
      const zhDescription = description?.zh || 
        (profession?.zh ? `${profession.zh} - ${description?.zh || ''}` : '') ||
        origData.description || '';
      
      // 构建干净的 frontmatter
      let cleanFM = `---\nname: ${zhName}\n`;
      
      // 添加描述（如果有特殊字符则加引号）
      if (zhDescription) {
        const needsQuote = /[:#{}[\\],&*?|>!%@`]/.test(zhDescription);
        const quotedDesc = needsQuote ? `"${zhDescription.replace(/"/g, '\\"')}"` : zhDescription;
        cleanFM += `description: ${quotedDesc}\n`;
      }
      
      // 添加 emoji（如果有）
      if (origData.emoji) {
        cleanFM += `emoji: ${origData.emoji}\n`;
      }
      
      // 添加 vibe（如果有）
      if (origData.vibe) {
        const needsQuote = /[:#{}[\\],&*?|>!%@`]/.test(origData.vibe);
        const quotedVibe = needsQuote ? `"${origData.vibe.replace(/"/g, '\\"')}"` : origData.vibe;
        cleanFM += `vibe: ${quotedVibe}\n`;
      }
      
      cleanFM += '---\n';
      
      // 构建新文件内容
      const newContent = cleanFM + '\n' + body;
      
      // 使用中文名称作为文件名
      const targetFileName = `${zhName}.md`;
      const targetPath = path.join(AGENT_DIR, targetFileName);
      
      // 写入文件
      await fs.writeFile(targetPath, newContent, 'utf-8');
      
      console.log(`✅ ${profession?.zh || displayName?.zh || id} -> ${targetFileName}`);
      integrated++;
      
    } catch (error) {
      console.log(`❌ ${profession?.zh || displayName?.zh || id}: ${error.message}`);
      errors++;
    }
  }
  
  console.log('\n📊 集成统计:');
  console.log(`  ✅ 成功: ${integrated}`);
  console.log(`  ⏭️  跳过: ${skipped}`);
  console.log(`  ❌ 错误: ${errors}`);
  console.log(`  📁 总计: ${integrated + skipped + errors}`);
  
  if (integrated > 0) {
    console.log('\n🎉 专家集成完成！');
    console.log('\n使用方法:');
    console.log('  1. 重启 OpenCode 桌面应用');
    console.log('  2. 按 Ctrl+A 打开 Agent 选择对话框');
    console.log('  3. 选择中文名称的专家');
  }
}

main().catch(console.error);
