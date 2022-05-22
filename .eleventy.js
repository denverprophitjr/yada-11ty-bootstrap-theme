const { DateTime } = require("luxon");
const { promisify } = require("util");
const fs = require("fs");
const path = require("path");
const hasha = require("hasha");
const touch = require("touch");
const readFile = promisify(fs.readFile);
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const execFile = promisify(require("child_process").execFile);
const pluginRss = require("@11ty/eleventy-plugin-rss");
const pluginSyntaxHighlight = require("@11ty/eleventy-plugin-syntaxhighlight");
const pluginNavigation = require("@11ty/eleventy-navigation");
const markdownIt = require("markdown-it");
const markdownItAnchor = require("markdown-it-anchor");
const markdownItAtrr = require("markdown-it-attrs");
const localImages = require("./_11ty/plugins/eleventy-plugin-local-images/.eleventy.js");
const CleanCSS = require("clean-css");
const GA_ID = require("./src/_data/metadata.json").googleAnalyticsId;
const imageShortcode = require("./_11ty/plugins/11ty-image/image");
module.exports = function (eleventyConfig) {
  eleventyConfig.addPlugin(pluginRss);
  eleventyConfig.addPlugin(pluginSyntaxHighlight);
  eleventyConfig.addPlugin(pluginNavigation);
  eleventyConfig.addNunjucksShortcode("image", imageShortcode);

  eleventyConfig.addPlugin(localImages, {
    distPath: "_site",
    assetPath: "/img/remote",
    selector:
      "img,meta[property='og:image'],meta[name='twitter:image']",
    verbose: false,
  });

  eleventyConfig.addPlugin(require("./_11ty/json-ld.js"));
  eleventyConfig.addPlugin(require("./_11ty/optimize-html.js"));
  eleventyConfig.setDataDeepMerge(true);

  eleventyConfig.addLayoutAlias("default", "layouts/base.njk");

  eleventyConfig.addNunjucksAsyncFilter(
    "addHash",
    function (absolutePath, callback) {
      readFile(path.join(".", absolutePath), {
        encoding: "utf-8",
      })
        .then((content) => {
          return hasha.async(content);
        })
        .then((hash) => {
          callback(null, `${absolutePath}?hash=${hash.substr(0, 10)}`);
        })
        .catch((error) => {
          callback(
            new Error(`Failed to addHash to '${absolutePath}': ${error}`)
          );
        });
    }
  );

  async function lastModifiedDate(filename) {
    try {
      const { stdout } = await execFile("git", [
        "log",
        "-1",
        "--format=%cd",
        filename,
      ]);
      return new Date(stdout);
    } catch (e) {
      console.error(e.message);
      // Fallback to stat if git isn't working.
      const stats = await stat(filename);
      return stats.mtime; // Date
    }
  }
  // Cache the lastModifiedDate call because shelling out to git is expensive.
  // This means the lastModifiedDate will never change per single eleventy invocation.
  const lastModifiedDateCache = new Map();
  eleventyConfig.addNunjucksAsyncFilter(
    "lastModifiedDate",
    function (filename, callback) {
      const call = (result) => {
        result.then((date) => callback(null, date));
        result.catch((error) => callback(error));
      };
      const cached = lastModifiedDateCache.get(filename);
      if (cached) {
        return call(cached);
      }
      const promise = lastModifiedDate(filename);
      lastModifiedDateCache.set(filename, promise);
      call(promise);
    }
  );

  eleventyConfig.addFilter("encodeURIComponent", function (str) {
    return encodeURIComponent(str);
  });

  eleventyConfig.addFilter("cssmin", function (code) {
    return new CleanCSS({}).minify(code).styles;
  });

  eleventyConfig.addFilter("readableDate", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat(
      "dd LLL yyyy"
    );
  });

  eleventyConfig.addNunjucksFilter("limit", (arr, limit) => arr.slice(0, limit));

  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  eleventyConfig.addFilter("htmlDateString", (dateObj) => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("yyyy-LL-dd");
  });

  eleventyConfig.addFilter("sitemapDateTimeString", (dateObj) => {
    const dt = DateTime.fromJSDate(dateObj, { zone: "utc" });
    if (!dt.isValid) {
      return "";
    }
    return dt.toISO();
  });

  // Get the first `n` elements of a collection.
  eleventyConfig.addFilter("head", (array, n) => {
    if (n < 0) {
      return array.slice(n);
    }

    return array.slice(0, n);
  });

  eleventyConfig.addCollection("technical", function(collectionApi) {
    return collectionApi.getFilteredByGlob("./src/technical-seo/*.md").sort(function(a, b) {
      //return a.date - b.date; // sort by date - ascending
      return b.date - a.date; // sort by date - descending
    });
});

  eleventyConfig.addCollection("content", function(collectionApi) {
    return collectionApi.getFilteredByGlob("./src/content-marketing/*.md").sort(function(a, b) {
      //return a.date - b.date; // sort by date - ascending
      return b.date - a.date; // sort by date - descending
    });
});

  eleventyConfig.addCollection("social", function(collectionApi) {
    return collectionApi.getFilteredByGlob("./src/social-marketing/*.md").sort(function(a, b) {
      //return a.date - b.date; // sort by date - ascending
      return b.date - a.date; // sort by date - descending
    });
});

  eleventyConfig.addCollection("tagList", require("./_11ty/getTagList"));
  eleventyConfig.addPassthroughCopy("assets/css");
  // We need to copy cached.js only if GA is used
  eleventyConfig.addPassthroughCopy(GA_ID ? "assets/js" : "js/*[!cached].*");
  // GA not used
  eleventyConfig.addPassthroughCopy("assets/js");
  eleventyConfig.addPassthroughCopy("assets/fonts");
  eleventyConfig.addPassthroughCopy("assets/img");
  eleventyConfig.addPassthroughCopy("content-marketing/images/*.jpg");
  eleventyConfig.addPassthroughCopy("social-media/images/*.jpg");
  eleventyConfig.addPassthroughCopy("technical-seo/images/*.jpg");

  // We need to rebuild upon JS change to update the CSP.
  eleventyConfig.addWatchTarget("./assets/js/");
  // We need to rebuild on CSS change to inline it.
  eleventyConfig.addWatchTarget("./assets/css/");
  // Unfortunately this means .eleventyignore needs to be maintained redundantly.
  // But without this the JS build artefacts doesn't trigger a build.
  eleventyConfig.setUseGitIgnore(false);

 // ****************Markdown Plugins********************
   let markdownLibrary = markdownIt({
    html: true,
    breaks: true,
    linkify: true,
  }).use(markdownItAnchor, {
    permalink: true,
    permalinkClass: "direct-link",
    permalinkSymbol: "#",
  }).use(markdownItAtrr, {
  // optional, these are default options
  leftDelimiter: '{',
  rightDelimiter: '}',
  allowedAttributes: []  // empty array = all attributes are allowed
});
  eleventyConfig.setLibrary("md", markdownLibrary);

 // Browsersync Overrides
  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: function (err, browserSync) {
        const content_404 = fs.readFileSync("_site/404.html");

        browserSync.addMiddleware("*", (req, res) => {
          // Provides the 404 content without redirect.
          res.write(content_404);
          res.end();
        });
      },
    },
    ui: false,
    ghostMode: false,
    reloadDelay: 400,
  });

  // After the build touch any file in the test directory to do a test run.
  eleventyConfig.on("afterBuild", async () => {
    const files = await readdir("./11ty/test");
    for (const file of files) {
      touch(`./11ty/test/${file}`);
      break;
    }
  });

  // After the build touch any file in the test directory to do a test run.
  eleventyConfig.on("afterBuild", async () => {
    const files = await readdir("./11ty/test");
    for (const file of files) {
      touch(`./11ty/test/${file}`);
      break;
    }
  });

  return {
    templateFormats: ["md", "njk", "html", "liquid"],

    // If your site lives in a different subdirectory, change this.
    // Leading or trailing slashes are all normalized away, so don’t worry about those.

    // If you don’t have a subdirectory, use "" or "/" (they do the same thing)
    // This is only used for link URLs (it does not affect your file structure)
    // Best paired with the `url` filter: https://www.11ty.io/docs/filters/url/

    // You can also pass this in on the command line using `--pathprefix`
    // pathPrefix: "/",

    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",

    // These are all optional, defaults are shown:
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      // Warning hardcoded throughout repo. Find and replace is your friend :)
      output: "_site",
    },
  };
};
