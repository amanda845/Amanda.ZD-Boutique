const fs = require('fs');

const content = fs.readFileSync('C:/Users/NIS/.gemini/antigravity-ide/brain/1990a0b7-2954-4699-9d22-4353fc0ab287/.system_generated/steps/370/content.md', 'utf8');

// Find all image URLs from staticdj or similar
const matches = content.match(/\/\/img\.staticdj\.com\/[a-zA-Z0-9_]+\.(?:jpg|jpeg|png|webp)/gi) || [];
const unique = [...new Set(matches.map(u => 'https:' + u))];

console.log('Unique images count:', unique.length);
console.log(JSON.stringify(unique, null, 2));
