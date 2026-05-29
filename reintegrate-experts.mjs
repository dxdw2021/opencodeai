#!/usr/bin/env node

// Re-integrate experts with clean frontmatter
// Strips down to only Agent-compatible fields: name, description, emoji, vibe, mode

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EXPERTS_DIR = path.join(__dirname, 'experts');
const TARGET_DIR = path.join(__dirname, '.opencode', 'agent');

async function cleanAndCopy() {
  console.log('Re-integrating experts with clean frontmatter...\n');
  
  // Read manifest
  const manifestPath = path.join(EXPERTS_DIR, 'manifest.json');
  const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf-8'));
  const experts = manifest.experts || [];
  
  // Clear target dir
  try {
    const oldFiles = await fs.readdir(TARGET_DIR);
    for (const f of oldFiles) {
      if (f.endsWith('.md')) {
        await fs.unlink(path.join(TARGET_DIR, f));
      }
    }
  } catch {}
  
  await fs.mkdir(TARGET_DIR, { recursive: true });
  
  let copied = 0;
  let errors = 0;
  
  for (const expert of experts) {
    const { id, displayName, promptFile, agentName, expertType } = expert;
    
    if (expertType !== 'agent' || !promptFile) continue;
    
    const sourcePath = path.join(EXPERTS_DIR, promptFile.startsWith('/') ? promptFile.slice(1) : promptFile);
    const targetFileName = `${agentName || id}.md`;
    const targetPath = path.join(TARGET_DIR, targetFileName);
    
    try {
      await fs.access(sourcePath);
      const content = await fs.readFile(sourcePath, 'utf-8');
      
      // Parse existing frontmatter
      let body = content;
      let origData = {};
      
      if (content.startsWith('---')) {
        const parts = content.split('---');
        if (parts.length >= 3) {
          const fm = parts[1];
          body = parts.slice(2).join('---');
          
          // Extract simple key-value pairs
          const nameMatch = fm.match(/^name:\s*(.+)$/m);
          const descMatch = fm.match(/^description:\s*(.+)$/m);
          const emojiMatch = fm.match(/^emoji:\s*(.+)$/m);
          const vibeMatch = fm.match(/^vibe:\s*(.+)$/m);
          
          if (nameMatch) origData.name = nameMatch[1].trim();
          if (descMatch) origData.description = descMatch[1].trim();
          if (emojiMatch) origData.emoji = emojiMatch[1].trim();
          if (vibeMatch) origData.vibe = vibeMatch[1].trim();
        }
      }
      
      // Build clean frontmatter with only supported fields
      const name = origData.name || agentName || id.toLowerCase();
      const description = origData.description || (displayName?.zh ? `${displayName.zh} - ${expert.profession?.zh || ''}` : '');
      
      // Quote description if it contains YAML special characters
      const needsQuote = /[:#{}[\],&*?|>!%@`]/.test(description);
      const quotedDesc = needsQuote ? `"${description.replace(/"/g, '\\"')}"` : description;
      
      let cleanFM = `---\nname: ${name}\ndescription: ${quotedDesc}\n`;
      if (origData.emoji) cleanFM += `emoji: ${origData.emoji}\n`;
      if (origData.vibe) cleanFM += `vibe: ${origData.vibe}\n`;
      cleanFM += `---`;
      
      const newContent = `${cleanFM}\n${body}`;
      await fs.writeFile(targetPath, newContent, 'utf-8');
      copied++;
    } catch (err) {
      console.error(`FAIL ${targetFileName}: ${err.message}`);
      errors++;
    }
  }
  
  console.log(`\nResults: ${copied} copied, ${errors} errors`);
}

cleanAndCopy().catch(console.error);