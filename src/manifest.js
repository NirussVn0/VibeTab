import { defineManifest } from '@crxjs/vite-plugin';
import packageJson from '../package.json';
// Convert main version to 3 integers (Chrome limits)
var _a = packageJson.version.split('.').map(Number), major = _a[0], minor = _a[1], patch = _a[2];
export default defineManifest({
    manifest_version: 3,
    name: "VibeTab",
    description: "A clean and modern new tab extension for pro developers.",
    version: "".concat(major, ".").concat(minor, ".").concat(patch),
    version_name: packageJson.version,
    permissions: [
        "storage",
        "bookmarks",
        "history",
        "tabs",
        "topSites",
        "alarms"
    ],
    chrome_url_overrides: {
        "newtab": "index.html"
    },
    background: {
        service_worker: "src/background.ts",
        type: "module"
    },
    icons: {
        "128": "public/icons/icon-128.png"
    }
});
