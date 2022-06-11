const path = require('path');
const footnotes = require('eleventy-plugin-footnotes');
const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight')

const {
  asideShortcode,
  imageShortcode,
  iconShortcode,
  socialIconShortcode,
  quoteShortcode,
  faviconShortcode,
} = require('./_11ty/shortcodes');

const {
  limit,
  sortByKey,
  toHtml,
  where,
  toISOString,
  formatDate,
  dividedBy,
  toAbsoluteUrl,
  getLatestCollectionItemDate,
  toAbsoluteImageUrl,
  pathParse,
  pathJoin,
} = require('./_11ty/filters/');

const {
  getAllPosts,
  getAllUniqueCategories,
  getPostsByCategory,
  getPopularCategories,
} = require('./_11ty/collections/');

const {
    markdownLib,
} = require('./_11ty/plugins/');

const { dir, imagePaths, scriptDirs } = require('./_11ty/constants');
const { slugifyString } = require('./_11ty/utils');
const { escape } = require('lodash');
const TEMPLATE_ENGINE = 'njk';

module.exports = (eleventyConfig) => {

  // Watch targets
  eleventyConfig.addWatchTarget(imagePaths.input);
  eleventyConfig.addWatchTarget(scriptDirs.input);

  // Pass-through copy for static assets
  eleventyConfig.addPassthroughCopy(`${dir.input}/${dir.assets}/fonts`);
  eleventyConfig.addPassthroughCopy(`${dir.input}/${dir.assets}/videos`);
  eleventyConfig.addPassthroughCopy(`${imagePaths.input}/404`);

  // Custom shortcodes
  eleventyConfig.addPairedShortcode('aside', asideShortcode);
  eleventyConfig.addPairedShortcode('quote', quoteShortcode);
  eleventyConfig.addShortcode('image', imageShortcode);
  eleventyConfig.addShortcode('favicon', faviconShortcode);
  eleventyConfig.addShortcode('icon', iconShortcode);
  eleventyConfig.addShortcode('socialIcon', socialIconShortcode);
  
  // Custom filters
  eleventyConfig.addFilter('limit', limit);
  eleventyConfig.addFilter('sortByKey', sortByKey);
  eleventyConfig.addFilter('where', where);
  eleventyConfig.addFilter('escape', escape);
  eleventyConfig.addFilter('toHtml', toHtml);
  eleventyConfig.addFilter('toIsoString', toISOString);
  eleventyConfig.addFilter('formatDate', formatDate);
  eleventyConfig.addFilter('dividedBy', dividedBy);
  eleventyConfig.addFilter('toAbsoluteUrl', toAbsoluteUrl);
  eleventyConfig.addFilter('toAbsoluteImageUrl', toAbsoluteImageUrl);
  eleventyConfig.addFilter('slugify', slugifyString);
  eleventyConfig.addFilter('toJson', JSON.stringify);
  eleventyConfig.addFilter('fromJson', JSON.parse);
  eleventyConfig.addFilter('getLatestCollectionItemDate', getLatestCollectionItemDate);
  eleventyConfig.addFilter('keys', Object.keys);
  eleventyConfig.addFilter('values', Object.values);
  eleventyConfig.addFilter('entries', Object.entries);
  eleventyConfig.addFilter('pathParse', pathParse);
  eleventyConfig.addFilter('pathJoin', pathJoin);

  // Custom collections
  eleventyConfig.addCollection('posts', getAllPosts);
  eleventyConfig.addCollection('categories', getAllUniqueCategories);
  eleventyConfig.addCollection('postsByCategory', getPostsByCategory);
  eleventyConfig.addCollection('popularCategories', getPopularCategories({ limit: 10, minCount: 5 }));

  // Plugins
  eleventyConfig.addPlugin(footnotes);
  eleventyConfig.addPlugin(syntaxHighlight);

  // Template Aliases
  eleventyConfig.addLayoutAlias('post', 'layouts/post.njk');
  eleventyConfig.addLayoutAlias('home', 'layouts/home.njk');

  eleventyConfig.setLibrary('md', markdownLib);

  return {
    dir,
    dataTemplateEngine: TEMPLATE_ENGINE,
    markdownTemplateEngine: TEMPLATE_ENGINE,
    htmlTemplateEngine: TEMPLATE_ENGINE,
    templateFormats: ['html', 'md', TEMPLATE_ENGINE],
  };
};
