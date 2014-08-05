module.exports = {
  all: {
    src: [
      'tmp/assets/images/*',
    ],

    destImg: 'www/assets/canvas-quiz-statistics.png',
    destCSS: 'src/css/compiled/images.less',
    engine: 'gm',
    engineOpts: {
      imagemagick: true
    },

    imgOpts: {
      format: 'png',
      quality: 100,
    },

    padding: 4,

    algorithm: 'binary-tree',
    cssFormat: 'less',
    cssOpts: {
      // CSS template allows for overriding of CSS selectors
      cssClass: function (item) {
        return '.sprite-' + item.name;
      }
    }
  }
};