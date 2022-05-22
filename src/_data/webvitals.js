const metadata = require("./metadata.json");

module.exports = function () {
  // Check opt-in to send CWV metrics to GA.
  return metadata.sendWebVitals;
};
