const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

const API_TOKEN = process.env.TODOIST_API_TOKEN;

if (!API_TOKEN) {
  console.error('Error: TODOIST_API_TOKEN environment variable is not set.');
  process.exit(1);
}

const PROJECT_ROOT = path.resolve(__dirname, '..');
// Exclude node_modules, .git, android, ios build folders to speed up and avoid noise
const EXCLUDES = ['node_modules', '.git', 'android', 'ios', 'dist', 'build', '.expo'];

function findTodos() {

  try {
    // using grep to find TODOs recursively, ignoring binary files and excluding directories
    // -r: recursive
    // -n: line number
    // -I: ignore binary
    const excludeFlags = EXCLUDES.map(dir => `--exclude-dir=${dir}`).join(' ');
    const command = `grep -r -n -I ${excludeFlags} "TODO" "${PROJECT_ROOT}"`;
    
    const output = execSync(command, { encoding: 'utf-8' });
    return output.split('\n').filter(line => line.trim() !== '').map(parseLine).filter(item => item !== null);
  } catch (error) {
    // grep returns exit code 1 if no matches found, which child_process treats as error
    if (error.status === 1) return [];
    console.error('Error searching for TODOs:', error.message);
    return [];
  }
}

function parseLine(line) {
  // Format: /path/to/file:line: content
  const firstColon = line.indexOf(':');
  const secondColon = line.indexOf(':', firstColon + 1);
  
  if (firstColon === -1 || secondColon === -1) return null;
  
  const filePath = line.substring(0, firstColon);
  const lineNum = line.substring(firstColon + 1, secondColon);
  const content = line.substring(secondColon + 1).trim();
  
  // Clean up content: remove comment syntax like //, /*, *, etc.
  const cleanContent = content
    .replace(/^(\/\/|\/\*|\*|\#|<!--)\s*/, '') // Remove start comment chars
    .replace(/\s*(\*\/|-->)$/, '') // Remove end comment chars
    .replace(/^TODO:?\s*/i, '') // Remove "TODO" label
    .trim();

  if (!cleanContent) return null;

  return {
    file: path.relative(PROJECT_ROOT, filePath),
    line: lineNum,
    text: cleanContent
  };
}

async function createTodoistTask(todo) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      content: todo.text,
      description: `Found in \`${todo.file}:${todo.line}\``,
      priority: 1
    });

    const options = {
      hostname: 'api.todoist.com',
      port: 443,
      path: '/rest/v2/tasks',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_TOKEN}`,
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(JSON.parse(body));
        } else {
          reject(new Error(`Status ${res.statusCode}: ${body}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

async function main() {
  const todos = findTodos();


  let successCount = 0;
  let failCount = 0;

  for (const todo of todos) {
    try {

      await createTodoistTask(todo);
      successCount++;
      // Rate limiting: sleep a bit
      await new Promise(r => setTimeout(r, 500));
    } catch (error) {
      console.error(`Failed to add "${todo.text}":`, error.message);
      failCount++;
    }
  }


}

main();
