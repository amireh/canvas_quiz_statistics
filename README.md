# canvas-quiz-statistics

A quiz statistics mini-app for Canvas, the LMS by Instructure.

## Development

    - `npm install`
    - `grunt` to run the watcher for linting, CSS compilation, and tests
    - `grunt server` to launch a Connect server at [http://localhost:8000]
    - `grunt build` to build a production-ready version of the app
    - `grunt test` to run the tests

## Dependencies

1. React
2. lodash / underscore
3. RSVP
4. d3

**Note on lodash**

Here's a list of the lodash methods that are currently used by CQS:

    * _.compact
    * _.extend
    * _.findWhere
    * _.map
    * _.merge

You can generate this list by running `grunt report:lodash_methods`.

## Configuring

[TODO]

## Installation: embedding into Canvas using r.js

The mini-app is expected to be embedded in a Canvas page. The dependency can be lazy-loaded, or if you prefer, it can be bundled along with the rest of the Canvas javascript build using the raw sources (`dist/canvas_quiz_statistics.js`).

**Step 1: configuring require.js**

Assuming we've installed the JavaScript source in `/public/javascripts/plugins`, we need to configure a path for the `canvas_quiz_statistics` module and map all dependencies that Canvas uses non-standard names for.

```javascript
requirejs.config({
  paths: {
    'canvas_quiz_statistics': 'plugins/canvas_quiz_statistics'
  },

  map: {
    // Scope the mapping to only this module so it does not affect others:
    'canvas_quiz_statistics': {
      'd3': 'vendor/d3.v3'
    }
  },
});
```
That should be good to go.

### Within an Ember.js context

One thing to watch out for when doing this is that you must pull in React manually before attempting to load the mini-app, otherwise it complains about missing shim-shams and shizzle. Follow the annotations below.

```javascript
// Pull RSVP out of Ember and alias it to a standalone "rsvp" module:
define('rsvp', [ 'ember' ], function(Ember) {
  return Ember.RSVP;
});

// Our Ember view will basically proxy to the mini-app by mounting it onto
// its element.
//
// Notice how we're loading React alongside Ember here, before we try to
// load CQS.
define([ 'require', 'ember', 'react' ], function(require, Ember, React) {
  return Ember.View.extend({
    embedCQS: function() {
      var node;

      // This is where we'll be mounting the mini-app, our Ember view's element:
      node = this.$()[0];

      // Keep our user entertained while we load up the mini-app:
      node.innerText = 'Downloading app data... please wait.';

      // Lazily load the mini-app:
      require([ 'canvas_quiz_statistics' ], function(CQS) {
        // Et voila! Mount it:
        this.cqsApp = CQS.mount(node);
      }.bind(this), function(error) {
        // Dang
        console.warn('CQS loading failed:', error, error.stack);
      });
    }.on('didInsertElement'),

    // Tear it down:
    removeCQS: function() {
      if (this.cqsApp) {
        this.cqsApp.unmount();
      }
    }.on('willRemoveElement')
  });
});
```

## License

Released under the AGPLv3 license, like [Canvas](http://github.com/instructure/canvas-lms).