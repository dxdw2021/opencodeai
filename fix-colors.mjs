#!/usr/bin/env node

// 修复专家文件中的颜色格式
// 将颜色名称转换为十六进制格式

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const AGENT_DIR = path.join(__dirname, '.opencode', 'agent');

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

async function fixColors() {
  console.log('🎨 修复专家文件颜色格式...\n');
  
  try {
    const files = await fs.readdir(AGENT_DIR);
    const mdFiles = files.filter(f => f.endsWith('.md'));
    
    let fixed = 0;
    let skipped = 0;
    let errors = 0;
    
    for (const file of mdFiles) {
      const filePath = path.join(AGENT_DIR, file);
      
      try {
        const content = await fs.readFile(filePath, 'utf-8');
        
        // 检查是否有 frontmatter
        if (!content.startsWith('---')) {
          skipped++;
          continue;
        }
        
        // 解析 frontmatter
        const parts = content.split('---');
        if (parts.length < 3) {
          skipped++;
          continue;
        }
        
        const frontmatter = parts[1];
        const rest = parts.slice(2).join('---');
        
        // 检查是否有颜色字段
        const colorMatch = frontmatter.match(/^color:\s*(.+)$/m);
        if (!colorMatch) {
          skipped++;
          continue;
        }
        
        const colorValue = colorMatch[1].trim();
        
        // 检查是否是十六进制格式（带或不带引号）
        const cleanColor = colorValue.replace(/^["']|["']$/g, '');
        if (/^#[0-9a-fA-F]{6}$/.test(cleanColor)) {
          // 如果有引号，去掉引号
          if (colorValue !== cleanColor) {
            const newFrontmatter = frontmatter.replace(
              /^color:\s*.+$/m,
              `color: ${cleanColor}`
            );
            const newContent = `---${newFrontmatter}---${rest}`;
            await fs.writeFile(filePath, newContent, 'utf-8');
            console.log(`✅ ${file}: ${colorValue} -> ${cleanColor} (去掉引号)`);
            fixed++;
          } else {
            skipped++;
          }
          continue;
        }
        
        // 检查是否是颜色名称
        const hexColor = COLOR_MAP[colorValue.toLowerCase()];
        if (!hexColor) {
          console.log(`⚠️  ${file}: 未知颜色 "${colorValue}"`);
          errors++;
          continue;
        }
        
        // 替换颜色
        const newFrontmatter = frontmatter.replace(
          /^color:\s*.+$/m,
          `color: ${hexColor}`
        );
        
        const newContent = `---${newFrontmatter}---${rest}`;
        
        await fs.writeFile(filePath, newContent, 'utf-8');
        console.log(`✅ ${file}: ${colorValue} -> ${hexColor}`);
        fixed++;
      } catch (err) {
        console.error(`❌ ${file}: ${err.message}`);
        errors++;
      }
    }
    
    console.log('\n' + '='.repeat(50));
    console.log(`📊 修复结果:`);
    console.log(`   ✅ 修复: ${fixed}`);
    console.log(`   ⏭️  跳过: ${skipped}`);
    console.log(`   ❌ 错误: ${errors}`);
    console.log('='.repeat(50));
  } catch (err) {
    console.error('❌ 无法读取目录:', err.message);
  }
}

fixColors().catch(console.error);