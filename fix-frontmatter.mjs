#!/usr/bin/env node

// 修复专家文件的 frontmatter
// 简化嵌套结构，解决 YAML 解析问题

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const AGENT_DIR = path.join(__dirname, '.opencode', 'agent');

async function fixFrontmatter() {
  console.log('🔧 修复专家文件 frontmatter...\n');
  
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
        
        // 检查是否有嵌套结构
        if (!frontmatter.includes('displayName:') && !frontmatter.includes('profession:')) {
          skipped++;
          continue;
        }
        
        // 简化 frontmatter
        let newFrontmatter = frontmatter;
        
        // 移除 displayName 和 profession 嵌套结构
        newFrontmatter = newFrontmatter.replace(/^displayName:\s*\n\s+en:\s*"[^"]*"\s*\n\s+zh:\s*"[^"]*"/m, '');
        newFrontmatter = newFrontmatter.replace(/^profession:\s*\n\s+en:\s*"[^"]*"\s*\n\s+zh:\s*"[^"]*"/m, '');
        
        // 移除 maxTurns 字段（如果存在）
        newFrontmatter = newFrontmatter.replace(/^maxTurns:\s*\d+$/m, '');
        
        // 清理空行
        newFrontmatter = newFrontmatter.replace(/\n\s*\n/g, '\n');
        
        const newContent = `---${newFrontmatter}---${rest}`;
        
        await fs.writeFile(filePath, newContent, 'utf-8');
        console.log(`✅ ${file}: 简化 frontmatter`);
        fixed++;
      } catch (err) {
        console.error(`❌ ${file}: ${err.message}`);
        errors++;
      }
    }
    
    console.log('\n' + '='.repeat(50));
    console.log(`📊 处理结果:`);
    console.log(`   ✅ 处理: ${fixed}`);
    console.log(`   ⏭️  跳过: ${skipped}`);
    console.log(`   ❌ 错误: ${errors}`);
    console.log('='.repeat(50));
  } catch (err) {
    console.error('❌ 无法读取目录:', err.message);
  }
}

fixFrontmatter().catch(console.error);