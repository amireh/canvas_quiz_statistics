module.exports = {
  src: {
    files: [
      {
        expand: true,
        cwd: 'src/js/',
        src: '**/*',
        dest: 'tmp/js/canvas_quiz_statistics'
      }, {
        expand: true,
        cwd: 'src/articles/',
        src: '**/*',
        dest: 'tmp/compiled/articles'
      }
    ]
  }
};