// Assembles src/index.template.html + sections/*.html into index.html.
// Usage: node build.mjs   (missing section files are skipped with a warning)
import { readFileSync, writeFileSync, existsSync } from 'node:fs';

let html = readFileSync('src/index.template.html', 'utf8');
html = html.replace(/<!-- @include (\S+) -->/g, (_, file) => {
  if (!existsSync(file)) { console.warn('missing:', file); return `<!-- missing ${file} -->`; }
  return `<!-- ▼ ${file} -->\n` + readFileSync(file, 'utf8').trim() + `\n<!-- ▲ ${file} -->`;
});
writeFileSync('index.html', html);
console.log('index.html built,', html.length, 'bytes');
