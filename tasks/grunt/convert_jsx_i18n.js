var glob = require('glob');
var fs = require('fs');
var extractTextBlocks = require('../extract_text_blocks');

module.exports = {
  description: 'Convert <Text /> blocks in JSX to Canvas-compatible I18n calls.',
  runner: function(grunt) {
    var path = 'tmp/js/canvas_quiz_statistics';

    glob.sync('**/*.jsx', { cwd: path }).forEach(function(fileName) {
      var filePath = path + '/' + fileName;
      var contents = String(fs.readFileSync(filePath));
      var newContents = extractTextBlocks.transform(contents);

      if (newContents !== contents) {
        console.log('Found <Text /> in', filePath);

        fs.writeFileSync(filePath, newContents);
      }
    });
  }
};