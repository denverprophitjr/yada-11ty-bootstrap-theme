const pluginFootnotes = require('eleventy-plugin-footnotes');

const { 
  baseClass = 'Footnotes',
  title = 'Footnotes',
  titleId = 'footnotes-label',
  backLinkLabel = ((_, index) => `Back to reference ${index + 1}`),
  classes = {}
  } = options;
const bemClass = getBemClass(baseClass)

module.exports = pluginFootnotes, options
