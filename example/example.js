const path = require('path');
const transformMarkdown = require('markdown-magic');
const travisBadgePlugin = require('../index.js');

const config = {
  transforms: {
    travisBadgePlugin,
  },
};

function callback() {
  console.log('ReadME generated.');
}

const markdownPath = path.join(__dirname, 'README.md');
transformMarkdown(markdownPath, config, callback);
