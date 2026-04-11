import fs from 'fs';
const base64 = fs.readFileSync('./public/favicon.png', 'base64');
fs.writeFileSync('./b64.txt', base64);
console.log('Base64 saved to b64.txt');
