#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// File paths
const CATEGORIES_FILE = path.join(__dirname, '../data/categories.json');
const SKILLS_DIR = path.join(__dirname, '../data/skills');

// Utility function to prompt for input
function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer);
    });
  });
}

// Utility function to prompt for input with default value
function questionWithDefault(prompt, defaultValue) {
  return new Promise((resolve) => {
    rl.question(`${prompt} [${defaultValue}]: `, (answer) => {
      resolve(answer || defaultValue);
    });
  });
}

// Load categories from categories.json
function loadCategories() {
  try {
    const data = fs.readFileSync(CATEGORIES_FILE, 'utf8');
    const json = JSON.parse(data);
    return json.skills;
  } catch (error) {
    console.error(`Error loading categories: ${error.message}`);
    process.exit(1);
  }
}

// Load skills file for a specific category
function loadSkillsFile(categoryKey) {
  const filePath = path.join(SKILLS_DIR, `${categoryKey}.json`);

  if (!fs.existsSync(filePath)) {
    // Create new file if it doesn't exist
    const categoryData = loadCategories()[categoryKey];
    const newFile = {
      category: categoryData.name,
      icon: categoryData.icon,
      skills: []
    };
    fs.writeFileSync(filePath, JSON.stringify(newFile, null, 2), 'utf8');
    console.log(`\n✓ Created new skills file: ${categoryKey}.json`);
    return newFile;
  }

  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error loading skills file: ${error.message}`);
    process.exit(1);
  }
}

// Save skills file
function saveSkillsFile(categoryKey, data) {
  const filePath = path.join(SKILLS_DIR, `${categoryKey}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
}

// Validate JSON file
function validateJSON(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    JSON.parse(data);
    return true;
  } catch (error) {
    console.error(`\n❌ Validation failed: ${error.message}`);
    return false;
  }
}

// Main function
async function main() {
  console.log('\n=== MoltBot Skill Addition Tool ===\n');

  // Load and display categories
  const categories = loadCategories();
  const categoryKeys = Object.keys(categories);

  console.log('Available categories:');
  categoryKeys.forEach((key, index) => {
    const cat = categories[key];
    console.log(`  ${index + 1}. ${key.padEnd(20)} ${cat.icon} ${cat.name}`);
  });
  console.log('');

  // Prompt for category selection
  const categoryChoice = await question('Select category (enter number or key): ');
  let selectedCategoryKey;

  if (parseInt(categoryChoice) >= 1 && parseInt(categoryChoice) <= categoryKeys.length) {
    selectedCategoryKey = categoryKeys[parseInt(categoryChoice) - 1];
  } else if (categories[categoryChoice]) {
    selectedCategoryKey = categoryChoice;
  } else {
    console.error(`\n❌ Invalid category selection`);
    rl.close();
    process.exit(1);
  }

  const selectedCategory = categories[selectedCategoryKey];
  console.log(`\n✓ Selected: ${selectedCategory.icon} ${selectedCategory.name}\n`);

  // Load existing skills file
  const skillsData = loadSkillsFile(selectedCategoryKey);
  const currentCount = skillsData.skills.length;
  console.log(`Current skills in this category: ${currentCount}\n`);

  // Collect skill information
  console.log('Enter skill details:\n');

  const id = await question('Skill ID (e.g., my-awesome-skill): ');
  if (!id) {
    console.error('\n❌ Skill ID is required');
    rl.close();
    process.exit(1);
  }

  const name = await questionWithDefault('Skill name (usually same as ID)', id);

  const title = await question('Skill title (display name): ');
  if (!title) {
    console.error('\n❌ Skill title is required');
    rl.close();
    process.exit(1);
  }

  const description = await question('Skill description: ');
  if (!description) {
    console.error('\n❌ Skill description is required');
    rl.close();
    process.exit(1);
  }

  const author = await question('Author name: ');
  if (!author) {
    console.error('\n❌ Author is required');
    rl.close();
    process.exit(1);
  }

  const github_url = await question('GitHub URL: ');
  if (!github_url) {
    console.error('\n❌ GitHub URL is required');
    rl.close();
    process.exit(1);
  }

  const install_cmd = await questionWithDefault(
    'Install command',
    `molt install ${id}`
  );

  const featuresInput = await question('Features (comma-separated): ');
  const features = featuresInput ? featuresInput.split(',').map(f => f.trim()) : [];

  const use_case = await question('Use case: ');

  const stars = await questionWithDefault('Stars count', 'N/A');

  const image = await questionWithDefault(
    'Image URL',
    'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80'
  );

  const tagsInput = await question('Tags (comma-separated): ');
  const tags = tagsInput ? tagsInput.split(',').map(t => t.trim()) : [];

  const icon = await questionWithDefault('Icon (emoji)', selectedCategory.icon);

  // Create skill object
  const newSkill = {
    id,
    name,
    title,
    description,
    author,
    github_url,
    install_cmd,
    category: selectedCategory.name,
    features,
    use_case,
    stars,
    image,
    tags,
    icon
  };

  // Display summary
  console.log('\n=== Skill Summary ===');
  console.log(JSON.stringify(newSkill, null, 2));

  const confirm = await question('\nAdd this skill? (yes/no): ');
  if (confirm.toLowerCase() !== 'yes' && confirm.toLowerCase() !== 'y') {
    console.log('\n❌ Cancelled');
    rl.close();
    process.exit(0);
  }

  // Add skill to the array
  skillsData.skills.push(newSkill);

  // Save to file
  saveSkillsFile(selectedCategoryKey, skillsData);
  console.log(`\n✓ Skill added to ${selectedCategoryKey}.json`);

  // Validate the JSON
  const filePath = path.join(SKILLS_DIR, `${selectedCategoryKey}.json`);
  if (validateJSON(filePath)) {
    console.log(`✓ JSON validation passed`);
  } else {
    console.error(`\n❌ JSON validation failed! Please check the file manually.`);
    rl.close();
    process.exit(1);
  }

  // Display updated count
  const newCount = skillsData.skills.length;
  console.log(`\n=== Success ===`);
  console.log(`Category: ${selectedCategory.icon} ${selectedCategory.name}`);
  console.log(`Previous skill count: ${currentCount}`);
  console.log(`New skill count: ${newCount}`);
  console.log(`Added: ${title}\n`);

  rl.close();
}

// Run the script
main().catch(error => {
  console.error(`\n❌ Error: ${error.message}`);
  rl.close();
  process.exit(1);
});
