var Root = this;
var DEBUG = {
};

!Root.__TESTING__ && define(function(require) {
  require([ 'boot' ], function(boot) {
    DEBUG.update = boot.update;
  });

  require([ 'react' ], function(React) {
    DEBUG.React = React;
  })
});