import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);

const getArg = (name) => {
  const index = args.indexOf(`--${name}`);
  if (index === -1) {
    return undefined;
  }

  return args[index + 1];
};

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9/\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/\/+/g, '/')
    .replace(/^\/+|\/+$/g, '');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

const title = getArg('title');
const author = getArg('author') ?? 'Base engineering';
const description = getArg('description') ?? 'Explain the problem, tradeoff, and production result.';
const role = getArg('role') ?? 'Engineer';
const slug = getArg('slug') ?? (title ? slugify(title) : undefined);

if (!title) {
  console.error('Missing required argument: --title');
  process.exit(1);
}

if (!slug) {
  console.error('Missing required argument: --slug or --title');
  process.exit(1);
}

const templatePath = path.join(projectRoot, 'templates', 'post-template.mdx');
const outputPath = path.join(projectRoot, 'src', 'content', 'posts', `${slug}.mdx`);
const outputDir = path.dirname(outputPath);
const widgetImportPath = path
  .relative(outputDir, path.join(projectRoot, 'src', 'components', 'widgets', 'ThroughputExplorer'))
  .replace(/\\/g, '/');

const date = new Date().toISOString().slice(0, 10);

const template = await readFile(templatePath, 'utf8');
const content = template
  .replace(/__TITLE__/g, title)
  .replace(/__DESCRIPTION__/g, description)
  .replace(/__DATE__/g, date)
  .replace(/__AUTHOR__/g, author)
  .replace(/__ROLE__/g, role)
  .replace(/__WIDGET_IMPORT__/g, widgetImportPath);

await mkdir(outputDir, { recursive: true });

try {
  await writeFile(outputPath, content, { flag: 'wx' });
} catch (error) {
  if (error && typeof error === 'object' && 'code' in error && error.code === 'EEXIST') {
    console.error(`Post already exists: ${outputPath}`);
    process.exit(1);
  }

  throw error;
}

console.log(`Created ${path.relative(projectRoot, outputPath)}`);
console.log('Next steps:');
console.log(`1. Open ${path.relative(projectRoot, outputPath)}`);
console.log('2. Replace the placeholder copy and imports');
console.log('3. Set draft: false when the post is ready to publish');
