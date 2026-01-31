#!/usr/bin/env node

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

function generateId(date) {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 100).toString().padStart(2, '0');
  return `${date}-${random}`;
}

function getFilePath(date) {
  const yearMonth = date.substring(0, 7);
  const dir = path.join(__dirname, '../data/news');
  const filePath = path.join(dir, `${yearMonth}.json`);
  return { dir, filePath, yearMonth };
}

function loadOrCreateFile(filePath, dir, yearMonth) {
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } else {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    return {
      month: yearMonth,
      items: []
    };
  }
}

function saveFile(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

function validateJson(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    JSON.parse(content);
    return true;
  } catch (error) {
    console.error('Validation failed:', error.message);
    return false;
  }
}

async function getTags() {
  const tagsInput = await question('Enter tags (comma-separated, e.g., "发布,热门,GitHub"): ');
  if (!tagsInput.trim()) {
    return [];
  }
  return tagsInput.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
}

async function main() {
  console.log('=== Add News Item ===\n');

  try {
    const title = await question('Title: ');
    if (!title.trim()) {
      console.error('Error: Title is required.');
      rl.close();
      process.exit(1);
    }

    const summary = await question('Summary: ');
    if (!summary.trim()) {
      console.error('Error: Summary is required.');
      rl.close();
      process.exit(1);
    }

    const platform = await question('Platform (e.g., "GitHub Releases", "Product Hunt", "Hacker News"): ');
    if (!platform.trim()) {
      console.error('Error: Platform is required.');
      rl.close();
      process.exit(1);
    }

    const platformType = await question('Platform type (中文/英文, default: 英文): ') || '英文';

    const sourceUrl = await question('Source URL: ');
    if (!sourceUrl.trim()) {
      console.error('Error: Source URL is required.');
      rl.close();
      process.exit(1);
    }

    const publishDate = await question('Publish date (YYYY-MM-DD, default: today): ') || new Date().toISOString().split('T')[0];

    const image = await question('Image URL (optional, press Enter to skip): ') || 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80';

    console.log('\nEnter tags (comma-separated):');
    const tags = await getTags();

    const { dir, filePath, yearMonth } = getFilePath(publishDate);
    const data = loadOrCreateFile(filePath, dir, yearMonth);

    const id = generateId(publishDate);

    const newItem = {
      id,
      title,
      summary,
      platform,
      platform_type: platformType,
      source_url: sourceUrl,
      publish_date: publishDate,
      image,
      tags
    };

    data.items.push(newItem);
    saveFile(filePath, data);

    console.log(`\n✓ News item added successfully!`);
    console.log(`  File: ${filePath}`);
    console.log(`  ID: ${id}`);

    if (validateJson(filePath)) {
      console.log('✓ JSON validation passed.');
    } else {
      console.error('✗ JSON validation failed!');
      process.exit(1);
    }

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

main();
