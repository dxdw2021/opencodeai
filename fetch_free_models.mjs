#!/usr/bin/env node

/**
 * 获取 OpenCode 免费模型列表
 * 使用 public API Key 获取可用模型并保存为 JSON
 */

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_BASE = 'opencode.ai';
const OUTPUT_FILE = 'free_models.json';

// 发送 HTTP 请求
function fetchModels() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: API_BASE,
      port: 443,
      path: '/zen/v1/models',
      method: 'GET',
      headers: {
        'Authorization': 'Bearer public',
        'User-Agent': 'OpenCode-FreeModels-Fetcher/1.0'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json);
        } catch (e) {
          reject(new Error(`解析 JSON 失败: ${e.message}`));
        }
      });
    });

    req.on('error', (e) => {
      reject(new Error(`请求失败: ${e.message}`));
    });

    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('请求超时'));
    });

    req.end();
  });
}

// 测试模型是否可用（public 访问）
async function testModel(modelId) {
  return new Promise((resolve) => {
    const postData = JSON.stringify({
      model: modelId,
      messages: [{ role: 'user', content: 'Hi' }],
      max_tokens: 10,
      stream: false
    });

    const options = {
      hostname: API_BASE,
      port: 443,
      path: '/zen/v1/chat/completions',
      method: 'POST',
      headers: {
        'Authorization': 'Bearer public',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        'User-Agent': 'OpenCode-FreeModels-Fetcher/1.0'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          // 检查是否有错误
          const isFree = !json.error;
          resolve({
            model: modelId,
            isFree: isFree,
            status: isFree ? 'available' : 'requires_api_key',
            error: json.error?.message || null
          });
        } catch (e) {
          resolve({
            model: modelId,
            isFree: false,
            status: 'error',
            error: '解析响应失败'
          });
        }
      });
    });

    req.on('error', () => {
      resolve({
        model: modelId,
        isFree: false,
        status: 'error',
        error: '请求失败'
      });
    });

    req.setTimeout(15000, () => {
      req.destroy();
      resolve({
        model: modelId,
        isFree: false,
        status: 'timeout',
        error: '请求超时'
      });
    });

    req.write(postData);
    req.end();
  });
}

// 主函数
async function main() {
  console.log('🚀 正在获取 OpenCode 模型列表...\n');

  try {
    // 1. 获取所有模型
    const modelsData = await fetchModels();
    const allModels = modelsData.data || [];
    
    console.log(`📋 找到 ${allModels.length} 个模型`);
    console.log('🔍 正在测试哪些模型支持免费访问...\n');

    // 2. 测试每个模型（限制并发）
    const batchSize = 5;
    const results = [];
    
    for (let i = 0; i < allModels.length; i += batchSize) {
      const batch = allModels.slice(i, i + batchSize);
      const batchResults = await Promise.all(
        batch.map(m => testModel(m.id))
      );
      results.push(...batchResults);
      
      // 显示进度
      const progress = Math.min(i + batchSize, allModels.length);
      console.log(`  进度: ${progress}/${allModels.length}`);
    }

    // 3. 分类结果
    const freeModels = results.filter(r => r.isFree);
    const paidModels = results.filter(r => !r.isFree && r.status === 'requires_api_key');
    const errorModels = results.filter(r => r.status === 'error' || r.status === 'timeout');

    // 4. 生成输出
    const output = {
      metadata: {
        fetchedAt: new Date().toISOString(),
        apiEndpoint: `https://${API_BASE}/zen/v1`,
        totalModels: allModels.length,
        freeModelsCount: freeModels.length,
        paidModelsCount: paidModels.length,
        errorModelsCount: errorModels.length
      },
      freeModels: freeModels.map(r => ({
        id: r.model,
        apiKey: 'public',
        endpoint: `https://${API_BASE}/zen/v1/chat/completions`,
        usage: {
          authorization: 'Bearer public',
          contentType: 'application/json'
        }
      })),
      paidModels: paidModels.map(r => ({
        id: r.model,
        note: '需要有效的 API Key',
        error: r.error
      })),
      errors: errorModels.map(r => ({
        id: r.model,
        status: r.status,
        error: r.error
      })),
      exampleRequest: {
        curl: `curl https://${API_BASE}/zen/v1/chat/completions \\\n  -H "Content-Type: application/json" \\\n  -H "Authorization: Bearer public" \\\n  -d '{"model": "${freeModels[0]?.model || 'gpt-5-nano'}", "messages": [{"role": "user", "content": "Hello!"}]}'`,
        javascript: `const response = await fetch('https://${API_BASE}/zen/v1/chat/completions', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer public'
  },
  body: JSON.stringify({
    model: '${freeModels[0]?.model || 'gpt-5-nano'}',
    messages: [{ role: 'user', content: 'Hello!' }],
    stream: false
  })
});
const data = await response.json();`,
        python: `import requests

response = requests.post(
    'https://${API_BASE}/zen/v1/chat/completions',
    headers={
        'Content-Type': 'application/json',
        'Authorization': 'Bearer public'
    },
    json={
        'model': '${freeModels[0]?.model || 'gpt-5-nano'}',
        'messages': [{'role': 'user', 'content': 'Hello!'}],
        'stream': False
    }
)
data = response.json()`
      }
    };

    // 5. 保存到文件
    const outputPath = path.resolve(OUTPUT_FILE);
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2), 'utf8');

    // 6. 输出结果
    console.log('\n✅ 完成！\n');
    console.log(`📊 统计:`);
    console.log(`   - 免费模型: ${freeModels.length} 个`);
    console.log(`   - 需 API Key: ${paidModels.length} 个`);
    console.log(`   - 测试失败: ${errorModels.length} 个`);
    
    console.log(`\n📝 免费模型列表:`);
    freeModels.forEach(m => console.log(`   ✓ ${m.model}`));

    console.log(`\n💾 结果已保存到: ${outputPath}`);

  } catch (error) {
    console.error('\n❌ 错误:', error.message);
    process.exit(1);
  }
}

main();
