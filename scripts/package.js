import fs from 'fs';
import path from 'path';
import archiver from 'archiver';
import { fileURLToPath } from 'url';
import packageJson from '../package.json' with { type: 'json' };

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DIST_DIR = path.join(__dirname, '../dist');
const RELEASE_DIR = path.join(__dirname, '../release');

if (!fs.existsSync(DIST_DIR)) {
    console.error('❌ dist/ directory not found. Run "npm run build" first.');
    process.exit(1);
}

if (!fs.existsSync(RELEASE_DIR)) {
    fs.mkdirSync(RELEASE_DIR);
}

const version = packageJson.version;
const zipName = `vibetab-v${version}.zip`;
const output = fs.createWriteStream(path.join(RELEASE_DIR, zipName));
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () => {
    console.log(`✅ Release packaged: release/${zipName} (${archive.pointer()} bytes)`);
});

archive.on('error', (err) => {
    throw err;
});

archive.pipe(output);
archive.directory(DIST_DIR, false);
archive.finalize();
