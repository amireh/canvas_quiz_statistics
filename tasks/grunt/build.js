module.exports = {
  description: 'Build a production-ready version.',
  runner: [
    'clean:compiled_symlink',
    'clean:compiled_jsx',
    'copy:src',
    'convert_jsx_i18n',
    'react',
    'compile_js',
    'compile_css'
  ]
};