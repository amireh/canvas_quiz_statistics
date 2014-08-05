requirejs.config({
  baseUrl: '/src/js',
  map: {
    '*': {
      'underscore': 'lodash',
    }
  },
  paths: {
    'text': '../../vendor/js/require/text',
    'i18n': '../../vendor/js/require/i18n',
    'jsx': '../../vendor/js/require/jsx',
    'JSXTransformer': '../../vendor/js/require/JSXTransformer-0.10.0',
    'react': '../../vendor/js/react-0.10.0',
    'inflection':   '../../vendor/js/inflection',
    'd3': '../../vendor/js/d3.v3',
    'lodash': '../../vendor/js/lodash.custom',
    'rsvp': '../../vendor/js/rsvp'
  },

  shim: {
    'inflection':     [],
    'd3': { exports: 'd3' },
    'lodash': {
      exports: '_'
    }
  },

  jsx: {
    fileExtension: '.jsx'
  },

  waitSeconds: 20
});

require([ 'boot' ]);