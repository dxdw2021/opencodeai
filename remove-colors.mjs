#!/usr/bin/env node

// 删除专家文件中的颜色字段
// 解决颜色解析问题

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const AGENT_DIR = path.join(__dirname, '.opencode', 'agent');

async function removeColors() {
  console.log('🗑️  删除专家文件颜色字段...\n');
  
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
        if (!frontmatter.includes('color:')) {
          skipped++;
          continue;
        }
        
        // 删除颜色字段
        const newFrontmatter = frontmatter.replace(/^color:\s*.+$/m, '');
        
        const newContent = `---${newFrontmatter}---${rest}`;
        
        await fs.writeFile(filePath, newContent, 'utf-8');
        console.log(`✅ ${file}: 删除颜色字段`);
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

removeColors().catch(console.error);