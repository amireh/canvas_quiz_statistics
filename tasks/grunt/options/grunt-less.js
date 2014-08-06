module.exports = {
  options: {
    strictImports: true
  },
  production: {
    options: {
      paths: [ 'src/css' ],
      compress: false
    },
    files: {
      "dist/<%= grunt.moduleId %>.css": "src/css/app.less",
    }
  }
};