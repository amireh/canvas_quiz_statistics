module.exports = {
  www: {
    options: {
      keepalive: true,
      port: 8000,
      base: 'www'
    }
  },

  tests: {
    options: {
      keepalive: false,
      port: 8001,
      hostname: '*'
    }
  },

  docs: {
    options: {
      keepalive: true,
      port: 8002,
      base: "doc"
    }
  },
};
