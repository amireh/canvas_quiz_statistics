var shell = require('shelljs');
var printHelp = function() {
  console.log('Usage: grunt report:TARGET');
  console.log('\nAvailable targets:');
  console.log('  - "lodash_methods": print all the used lodash methods');
};

module.exports = {
  description: 'Use the development, non-optimized JS sources.',
  runner: function(grunt, target) {
    switch(target) {
      case 'lodash_methods':
        shell.exec("echo 'Reporting used lodash methods:'");
        shell.exec("grep -rPoh '_\\.[^\\b|\\(|;]+' src/js/ | sort | uniq");
      break;
      default:
        printHelp();
    }
  }
};