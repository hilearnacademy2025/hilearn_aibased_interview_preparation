const fs = require('fs');
const path = require('path');

const replacements = [
    // Backgrounds
    { match: /\bbg-\[#0f1f3d\]/g, replace: 'bg-[#0f1f3d] dark:bg-slate-900' },
    { match: /\bbg-\[#f9f7f4\]/g, replace: 'bg-[#f9f7f4] dark:bg-slate-800/50' },
    { match: /\bbg-\[#f4f2ee\]/g, replace: 'bg-[#f4f2ee] dark:bg-slate-800' },
    { match: /\bbg-white/g, replace: 'bg-white dark:bg-slate-900' },
    { match: /\bsurface-card/g, replace: 'surface-card dark:!bg-slate-900 dark:!border-slate-700' },
    
    // Text colors
    { match: /\btext-\[#0f1f3d\]/g, replace: 'text-[#0f1f3d] dark:text-white' },
    { match: /\btext-\[#5c5a57\]/g, replace: 'text-[#5c5a57] dark:text-slate-300' },
    { match: /\btext-\[#9c9a96\]/g, replace: 'text-[#9c9a96] dark:text-slate-400' },
    
    // Borders
    { match: /\bborder-\[#f0ede9\]/g, replace: 'border-[#f0ede9] dark:border-slate-700' },
    { match: /\bborder-\[#e0dbd3\]/g, replace: 'border-[#e0dbd3] dark:border-slate-700' },
];

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    // Avoid double replacement by removing any existing dark: variants for these base classes first (optional, but safer to just replace if not already there)
    // Actually simpler: just replace everything, but if we run it twice it might duplicate.
    
    // Since we're running it once, we'll just do simple string replacement on the whole file using regex
    for (const {match, replace} of replacements) {
        // We need to ensure we don't replace if dark: is already right after it
        // A simple way is to replace the match if it's NOT followed by " dark:"
        content = content.replace(match, (m, offset, str) => {
            if (str.substr(offset, m.length + 6).includes('dark:')) return m;
            return replace;
        });
    }
    
    if (content !== original) {
        fs.writeFileSync(filePath, content);
        console.log(`Updated ${filePath}`);
    }
}

function walk(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walk(fullPath);
        } else if (fullPath.endsWith('.jsx')) {
            processFile(fullPath);
        }
    }
}

walk('./frontend/src');
console.log("Done.");
