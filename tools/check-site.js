const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const publicDir = path.join(root, 'public');
const requiredFiles = ['sitemap.xml', 'robots.txt', 'local-search.xml'];
const forbiddenFiles = ['search.xml'];
const placeholderPattern = /yourdomain\.com|example\.com|KEY1|ENTER REPO|ENTER CATEGORY|用户名|123456/;
const missing = new Set();
const placeholders = [];

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const fullPath = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(fullPath) : [fullPath];
  });
}

function fileForUrl(value) {
  let url;
  try {
    url = new URL(value, 'https://local.invalid');
  } catch {
    return null;
  }
  if (url.hostname !== 'local.invalid') return null;

  const relative = decodeURIComponent(url.pathname).replace(/^\/+/, '');
  if (!relative) return path.join(publicDir, 'index.html');
  const direct = path.join(publicDir, relative);
  if (fs.existsSync(direct) && fs.statSync(direct).isFile()) return direct;
  if (fs.existsSync(path.join(direct, 'index.html'))) return path.join(direct, 'index.html');
  if (!path.extname(direct) && fs.existsSync(`${direct}.html`)) return `${direct}.html`;
  return direct;
}

if (!fs.existsSync(publicDir)) {
  console.error('public/ does not exist. Run hexo generate first.');
  process.exit(1);
}

for (const required of requiredFiles) {
  if (!fs.existsSync(path.join(publicDir, required))) missing.add(`required file: ${required}`);
}
for (const forbidden of forbiddenFiles) {
  if (fs.existsSync(path.join(publicDir, forbidden))) missing.add(`duplicate file must be absent: ${forbidden}`);
}

for (const file of walk(publicDir)) {
  if (!/\.(html|xml|txt)$/i.test(file)) continue;
  const content = fs.readFileSync(file, 'utf8');
  if (placeholderPattern.test(content)) placeholders.push(path.relative(root, file));
  const references = [...content.matchAll(/(?:href|src|action)=["']([^"']+)["']/gi)];
  for (const [, reference] of references) {
    if (!reference || reference.includes('{{') || reference.includes('}}') || reference.startsWith('#') || reference.startsWith('data:') || reference.startsWith('mailto:') || reference.startsWith('javascript:')) continue;
    const target = fileForUrl(reference);
    if (target && !fs.existsSync(target)) {
      missing.add(`${path.relative(root, file)} -> ${reference}`);
    }
  }
}

if (placeholders.length) {
  console.error(`Placeholder text found in: ${placeholders.join(', ')}`);
}
if (missing.size) {
  for (const item of missing) console.error(item);
  process.exit(1);
}

console.log(`Site check passed: ${walk(publicDir).length} generated files, ${requiredFiles.length} required entry files.`);
