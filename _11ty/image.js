const Image = require("@11ty/eleventy-img");
const path = require("path");
const fs = require("fs");
var collectionpath = process.cwd();
module.exports = function(src, alt, widths, sizes, classattr) {
  // src input same as 'normal' site-relative path for convenience, so add base path:
  src = collectionpath + src;
  let ext = src.substr(src.lastIndexOf(".") + 1);
  let currentFormat = ext == "png" ? "png" : "jpeg";
  let srcset = [100, 320, 640, 1024, 1536, 2048];
  if (widths) {
    widthsArray = widths.split(",");
    srcset = widthsArray.map(n => Number(n));
  }
  let options = {
    urlPath: collectionpath + "/image/",
    outputDir: collectionpath = "/image/",
    widths: srcset,
    formats: ["avif", "webp", currentFormat],
    filenameFormat: function(id, src, width, format, options) {
      // id: hash of the original image
      // src: original image path
      // width: current width in px
      // format: current file format
      // options: set of options passed to the Image call
      const extension = path.extname(src);
      const name = path.basename(src, extension);

      return `${name}-${id}-${width}w.${format}`;
    },
    sharpJpegOptions: {
      quality: 80, // default
      progressive: true
    },
    sharpAvifOptions: {
      quality: 80
    }
  };

  const stats = Image.statsSync(src, options);

  /** Creating a flat array of all the output paths from the stats object. */
  const outputPaths = Object.keys(stats).reduce((acc, key) => {
    return [
      ...acc,
      ...stats[key].map(resource => {
        return resource.outputPath;
      })
    ];
  }, []);

  /** Checking if all output files exists. */
  let hasImageBeenOptimized = true;
  for (const outputPath of outputPaths) {
    let fullPath = path.resolve(__dirname, "..", outputPath);
    /** Edit the output file path resolving, depending of this file */
    if (!fs.existsSync(fullPath)) {
      console.log("No image exists at :", fullPath);
      hasImageBeenOptimized = false;
    }
  }

  // generate images, only if they don't exist
  if (!hasImageBeenOptimized) {
    Image(src, options);
  }

  let imageAttributes = {
    alt,
    sizes,
    class: classattr ? classattr : true,
    loading: "lazy",
    decoding: "async",
    whitespaceMode: "inline"
  };
  // get metadata even the images are not fully generated
  metadata = Image.statsSync(src, options);
  return Image.generateHTML(metadata, imageAttributes);
};