const fs = require('fs');
const path = require('path');

// Fix paths in index.html for GitHub Pages deployment
const indexPath = path.join(__dirname, '../dist/index.html');
let indexContent = fs.readFileSync(indexPath, 'utf8');

// Replace absolute paths with relative paths
indexContent = indexContent.replace(/href="\/favicon\.ico"/g, 'href="./favicon.ico"');
indexContent = indexContent.replace(/src="\/_expo/g, 'src="./_expo');

// Write back the fixed content
fs.writeFileSync(indexPath, indexContent);

console.log('Fixed GitHub Pages paths in index.html');

// Also fix 404.html if it exists
const notFoundPath = path.join(__dirname, '../dist/404.html');
if (fs.existsSync(notFoundPath)) {
  let notFoundContent = fs.readFileSync(notFoundPath, 'utf8');
  notFoundContent = notFoundContent.replace(/href="\/favicon\.ico"/g, 'href="./favicon.ico"');
  notFoundContent = notFoundContent.replace(/src="\/_expo/g, 'src="./_expo');
  fs.writeFileSync(notFoundPath, notFoundContent);
  console.log('Fixed GitHub Pages paths in 404.html');
}