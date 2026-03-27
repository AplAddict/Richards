#!/usr/bin/env node

/**
 * Richard's Body Shop - Build & Optimization Script
 * Consolidates CSS, minifies JavaScript, and optimizes assets
 */

const fs = require('fs');
const path = require('path');

// Simple CSS minifier
function minifyCSS(css) {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove comments
    .replace(/\s+/g, ' ') // Collapse whitespace
    .replace(/\s*([{};:,])\s*/g, '$1') // Remove spaces around punctuation
    .trim();
}

// Simple JavaScript minifier (basic)
function minifyJS(js) {
  return js
    .replace(/\/\/.*$/gm, '') // Remove single-line comments
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove multi-line comments
    .replace(/\s+/g, ' ') // Collapse whitespace
    .replace(/\s*([{};:,=])\s*/g, '$1') // Remove spaces around punctuation
    .trim();
}

// Task 1: Consolidate CSS files
console.log('🔨 Consolidating CSS files...');
const cssFiles = [
  'css/default.css',
  'css/layout.css',
  'css/media-queries.css'
];

let consolidatedCSS = '';
cssFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    consolidatedCSS += '\n/* === ' + path.basename(file) + ' === */\n' + content;
  }
});

const minifiedCSS = minifyCSS(consolidatedCSS);
fs.writeFileSync('css/main.min.css', minifiedCSS);
console.log(`✅ Created css/main.min.css (${minifiedCSS.length} bytes)`);
console.log(`   Original combined: ${consolidatedCSS.length} bytes`);
console.log(`   Minified: ${minifiedCSS.length} bytes`);
console.log(`   Savings: ${Math.round((1 - minifiedCSS.length / consolidatedCSS.length) * 100)}%`);

// Task 2: Minify magnific-popup CSS separately (external library)
if (fs.existsSync('css/magnific-popup.css')) {
  const mpContent = fs.readFileSync('css/magnific-popup.css', 'utf8');
  const minifiedMP = minifyCSS(mpContent);
  fs.writeFileSync('css/magnific-popup.min.css', minifiedMP);
  console.log(`✅ Created css/magnific-popup.min.css`);
}

// Task 3: Minify JavaScript files
console.log('\n🔨 Minifying JavaScript files...');
const jsFiles = [
  'js/waypoints.js',
  'js/init.js',
  'js/magnific-popup.js',
  'js/jquery.flexslider.js',
  'js/jquery.fittext.js'
];

jsFiles.forEach(file => {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    const minified = minifyJS(content);
    const minPath = file.replace('.js', '.min.js');
    fs.writeFileSync(minPath, minified);
    const savings = Math.round((1 - minified.length / content.length) * 100);
    console.log(`✅ ${path.basename(file)} → ${savings}% reduction`);
  }
});

console.log('\n✨ Build complete!');
