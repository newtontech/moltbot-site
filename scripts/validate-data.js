#!/usr/bin/env node

/**
 * JSON Data Validation Script
 * Validates all JSON files in data/news/ and data/skills/ directories
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

class DataValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.allIds = new Set();
    this.duplicateIds = [];
  }

  /**
   * Main validation entry point
   */
  validate() {
    console.log(`${colors.cyan}═══════════════════════════════════════════════════════${colors.reset}`);
    console.log(`${colors.cyan}  JSON Data Validation Script${colors.reset}`);
    console.log(`${colors.cyan}═══════════════════════════════════════════════════════${colors.reset}\n`);

    const dataDir = path.join(__dirname, '..', 'data');
    const newsDir = path.join(dataDir, 'news');
    const skillsDir = path.join(dataDir, 'skills');

    // Validate news files
    console.log(`${colors.blue}Validating news files...${colors.reset}`);
    this.validateDirectory(newsDir, 'news');

    // Validate skills files
    console.log(`\n${colors.blue}Validating skills files...${colors.reset}`);
    this.validateDirectory(skillsDir, 'skills');

    // Check for duplicate IDs across all files
    this.checkDuplicateIds();

    // Print summary
    this.printSummary();

    // Return exit code
    return this.errors.length > 0 ? 1 : 0;
  }

  /**
   * Validate all JSON files in a directory
   */
  validateDirectory(dirPath, type) {
    if (!fs.existsSync(dirPath)) {
      this.addError(`Directory not found: ${dirPath}`);
      return;
    }

    const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.json'));

    if (files.length === 0) {
      this.addWarning(`No JSON files found in ${dirPath}`);
      return;
    }

    console.log(`  Found ${files.length} JSON file(s)\n`);

    files.forEach(file => {
      const filePath = path.join(dirPath, file);
      this.validateFile(filePath, type);
    });
  }

  /**
   * Validate a single JSON file
   */
  validateFile(filePath, type) {
    const fileName = path.basename(filePath);
    console.log(`  ${colors.yellow}Checking:${colors.reset} ${fileName}`);

    try {
      // Read and parse JSON
      const rawContent = fs.readFileSync(filePath, 'utf8');
      let data;

      try {
        data = JSON.parse(rawContent);
      } catch (parseError) {
        this.addError(`${fileName}: Invalid JSON syntax - ${parseError.message}`);
        return;
      }

      // Validate based on type
      if (type === 'news') {
        this.validateNewsFile(fileName, data);
      } else if (type === 'skills') {
        this.validateSkillsFile(fileName, data);
      }

      // Check for trailing comma
      if (rawContent.trim().endsWith(',')) {
        this.addWarning(`${fileName}: File ends with trailing comma`);
      }

    } catch (error) {
      this.addError(`${fileName}: Failed to read file - ${error.message}`);
    }
  }

  /**
   * Validate news file structure
   */
  validateNewsFile(fileName, data) {
    // Check root level properties
    if (!data.month) {
      this.addError(`${fileName}: Missing required field 'month'`);
    } else if (!/^\d{4}-\d{2}$/.test(data.month)) {
      this.addError(`${fileName}: Field 'month' must be in format YYYY-MM (got: ${data.month})`);
    }

    if (!Array.isArray(data.items)) {
      this.addError(`${fileName}: Missing or invalid 'items' array`);
      return;
    }

    if (data.items.length === 0) {
      this.addWarning(`${fileName}: 'items' array is empty`);
    }

    // Validate each news item
    data.items.forEach((item, index) => {
      const prefix = `${fileName}[item ${index}]`;

      // Required fields
      const requiredFields = ['id', 'title', 'summary', 'platform', 'platform_type', 'source_url', 'publish_date', 'image', 'tags'];
      requiredFields.forEach(field => {
        if (!item[field]) {
          this.addError(`${prefix}: Missing required field '${field}'`);
        }
      });

      // Validate ID
      if (item.id) {
        if (typeof item.id !== 'string') {
          this.addError(`${prefix}: Field 'id' must be a string`);
        } else {
          if (this.allIds.has(item.id)) {
            this.duplicateIds.push({ id: item.id, file: fileName });
          }
          this.allIds.add(item.id);
        }
      }

      // Validate title length
      if (item.title && typeof item.title === 'string' && item.title.length > 200) {
        this.addWarning(`${prefix}: Title is very long (${item.title.length} chars)`);
      }

      // Validate summary length
      if (item.summary && typeof item.summary === 'string' && item.summary.length > 500) {
        this.addWarning(`${prefix}: Summary is very long (${item.summary.length} chars)`);
      }

      // Validate URL
      if (item.source_url && !this.isValidUrl(item.source_url)) {
        this.addError(`${prefix}: Invalid URL format for 'source_url'`);
      }

      // Validate image URL
      if (item.image && !this.isValidUrl(item.image)) {
        this.addError(`${prefix}: Invalid URL format for 'image'`);
      }

      // Validate publish_date
      if (item.publish_date && !/^\d{4}-\d{2}-\d{2}$/.test(item.publish_date)) {
        this.addError(`${prefix}: Invalid date format for 'publish_date' (expected YYYY-MM-DD)`);
      }

      // Validate platform_type
      if (item.platform_type && !['中文', '英文'].includes(item.platform_type)) {
        this.addError(`${prefix}: 'platform_type' must be either '中文' or '英文' (got: ${item.platform_type})`);
      }

      // Validate tags
      if (item.tags) {
        if (!Array.isArray(item.tags)) {
          this.addError(`${prefix}: Field 'tags' must be an array`);
        } else if (item.tags.length === 0) {
          this.addWarning(`${prefix}: 'tags' array is empty`);
        }
      }
    });
  }

  /**
   * Validate skills file structure
   */
  validateSkillsFile(fileName, data) {
    // Check root level properties
    if (!data.category) {
      this.addError(`${fileName}: Missing required field 'category'`);
    }

    if (!data.icon) {
      this.addError(`${fileName}: Missing required field 'icon'`);
    } else if (typeof data.icon !== 'string' || data.icon.length !== 2 || !/^[\p{Emoji}]/u.test(data.icon)) {
      this.addWarning(`${fileName}: Field 'icon' should be a single emoji`);
    }

    if (!Array.isArray(data.skills)) {
      this.addError(`${fileName}: Missing or invalid 'skills' array`);
      return;
    }

    if (data.skills.length === 0) {
      this.addWarning(`${fileName}: 'skills' array is empty`);
    }

    // Validate each skill
    data.skills.forEach((skill, index) => {
      const prefix = `${fileName}[skill ${index}]`;

      // Required fields
      const requiredFields = ['id', 'name', 'title', 'description', 'author', 'github_url', 'install_cmd', 'category', 'features', 'use_case', 'stars', 'image', 'tags', 'icon'];
      requiredFields.forEach(field => {
        if (skill[field] === undefined || skill[field] === null || skill[field] === '') {
          this.addError(`${prefix}: Missing required field '${field}'`);
        }
      });

      // Validate ID
      if (skill.id) {
        if (typeof skill.id !== 'string') {
          this.addError(`${prefix}: Field 'id' must be a string`);
        } else {
          if (this.allIds.has(skill.id)) {
            this.duplicateIds.push({ id: skill.id, file: fileName });
          }
          this.allIds.add(skill.id);
        }
      }

      // Validate URLs
      if (skill.github_url && !this.isValidUrl(skill.github_url)) {
        this.addError(`${prefix}: Invalid URL format for 'github_url'`);
      }

      if (skill.image && !this.isValidUrl(skill.image)) {
        this.addError(`${prefix}: Invalid URL format for 'image'`);
      }

      // Validate stars format
      if (skill.stars && skill.stars !== 'N/A' && !/^\d+[+]?$/.test(skill.stars)) {
        this.addError(`${prefix}: Field 'stars' must be 'N/A' or a number (e.g., '100', '500+')`);
      }

      // Validate features array
      if (skill.features) {
        if (!Array.isArray(skill.features)) {
          this.addError(`${prefix}: Field 'features' must be an array`);
        } else if (skill.features.length === 0) {
          this.addWarning(`${prefix}: 'features' array is empty`);
        }
      }

      // Validate tags array
      if (skill.tags) {
        if (!Array.isArray(skill.tags)) {
          this.addError(`${prefix}: Field 'tags' must be an array`);
        } else if (skill.tags.length === 0) {
          this.addWarning(`${prefix}: 'tags' array is empty`);
        }
      }

      // Validate icon
      if (skill.icon && (typeof skill.icon !== 'string' || skill.icon.length !== 2)) {
        this.addWarning(`${prefix}: Field 'icon' should be a single emoji`);
      }
    });
  }

  /**
   * Validate URL format
   */
  isValidUrl(url) {
    if (typeof url !== 'string') return false;

    try {
      const parsed = new URL(url);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  }

  /**
   * Check for duplicate IDs across all files
   */
  checkDuplicateIds() {
    if (this.duplicateIds.length > 0) {
      console.log(`\n${colors.red}✗ Duplicate IDs found:${colors.reset}`);
      this.duplicateIds.forEach(({ id, file }) => {
        this.addError(`Duplicate ID '${id}' found in ${file}`);
      });
    }
  }

  /**
   * Add an error
   */
  addError(message) {
    this.errors.push(message);
    console.log(`    ${colors.red}✗${colors.reset} ${message}`);
  }

  /**
   * Add a warning
   */
  addWarning(message) {
    this.warnings.push(message);
    console.log(`    ${colors.yellow}⚠${colors.reset} ${message}`);
  }

  /**
   * Print validation summary
   */
  printSummary() {
    console.log(`\n${colors.cyan}═══════════════════════════════════════════════════════${colors.reset}`);
    console.log(`${colors.cyan}  Validation Summary${colors.reset}`);
    console.log(`${colors.cyan}═══════════════════════════════════════════════════════${colors.reset}\n`);

    const totalIds = this.allIds.size;

    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log(`${colors.green}✓ All validations passed!${colors.reset}`);
      console.log(`  Total unique IDs: ${totalIds}`);
    } else {
      if (this.errors.length > 0) {
        console.log(`${colors.red}✗ Errors: ${this.errors.length}${colors.reset}`);
      }

      if (this.warnings.length > 0) {
        console.log(`${colors.yellow}⚠ Warnings: ${this.warnings.length}${colors.reset}`);
      }

      console.log(`  Total unique IDs: ${totalIds}`);
    }

    console.log(`\n${colors.cyan}═══════════════════════════════════════════════════════${colors.reset}\n`);
  }
}

// Run validation
if (require.main === module) {
  const validator = new DataValidator();
  const exitCode = validator.validate();
  process.exit(exitCode);
}

module.exports = DataValidator;
