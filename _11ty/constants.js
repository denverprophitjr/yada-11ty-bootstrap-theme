const path = require('path');

const dir = {
  input: 'src',
  output: '_site',
  includes: '_includes',
  layouts: '_layouts',
  data: '_data',
  assets: 'assets',
};

const imagePaths = {
  input: path.join(dir.input, dir.assets, 'images'),
  output: path.join(dir.output, dir.assets, 'images'),
};

const scriptDirs = {
  input: path.join(dir.input, dir.assets, 'js'),
  output: path.join(dir.output, dir.assets, 'js'),
};

module.exports = {
  dir,
  imagePaths,
  scriptDirs,
};
