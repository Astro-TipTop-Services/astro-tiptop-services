const fs = require('fs');
const ini = require('ini');
const path = require('path');

const presetDir = path.resolve(__dirname, '../static/configs');
const outputFile = path.resolve(__dirname, '../src/configPresets.json');
const output = {};

fs.readdirSync(presetDir).forEach(file => {
  if (file.endsWith('.ini')) {
    const content = fs.readFileSync(path.join(presetDir, file), 'utf-8');
    const parsed = ini.parse(content);
    const name = path.basename(file, '.ini');
    output[name] = parsed;
  }
});


fs.writeFileSync(outputFile, JSON.stringify(output, null, 2));
console.log(`✅ configPresets.json generated with ${Object.keys(output).length} presets.`);