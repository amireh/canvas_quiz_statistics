# canvas-quiz-statistics

A quiz statistics mini-app for Canvas, the LMS by Instructure.

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

## Development

    - `npm install`
    - `grunt` to run the watcher for linting, CSS compilation, and tests
    - `grunt server` to launch a Connect server at [http://localhost:8000]
    - `grunt build` to build a production-ready version of the app
    - `grunt test` to run the tests

### r.js: all paths must be relative to current module

Do not require dependencies using an absolute path (e.g, relative to `baseUrl`) because that will bork the optimizer's output. We need all modules to be prefixed by `canvas_quiz_statistics/` in order not to clash with Canvas modules, as such:

```javascript
// in src/js/core/something.js

// BAD: don't do this
define([ 'core/something_else' ], function() {});

// GOOD
define([ './something_else' ], function() {});
```

### Working with JSX

You don't need to pre-compile or anything, using the `jsx` r.js loader will take care of compiling JSX on-the-fly as you develop, and will precompile when you optimize using `grunt build`.

Requiring components should be done as follows:

```javascript
require([ 'jsx!./path/to/component' ], function(Component) {
});
```

#### Testing components

Check out [jasmine_react](https://github.com/amireh/jasmine_react) for a boost on testing React components in Jasmine, and the specs in `test/unit/{views,components}`.

**What to test**

  - that the component (un)mounts fine initially without any custom props
  - branches that causes the component's state to change are behaving as expected
  - action emitters: code that triggers any `sendAction()` calls, and a verification of the parameters emitted
  - any funny thing happening in the component's life cycle hooks

You can stub component methods normally as you would other objects, sometimes you'll need to stub the `type` instead. Also, [jasmine_react](https://github.com/amireh/jasmine_react) provides a set of DOM helpers for finding elements, clicking, checking radio and checkboxes, simulating keyboard-input or typing in text, selecting values in a dropdown, and a few other things.

**What not to test**

  - JavaScript features (really!), like testing
    `{this.state.something ? "true" : "false"}`
  is just silly, you're testing the ternary operator then, instead cover the code that manipulates `this.state.something`
  - React features, like testing if the component starts with the default props you specified in getDefaultProps() or getInitialState()
  - whether the component breaks if it receives bad props

### I18n work

In order for things to be wired correctly, you must follow the same API Canvas uses for JavaScript I18n. Here is a sample:

```javascript
define(function(require) {
  // Get a translation scope:
  var I18n = require('i18n!quiz_statistics');

  // Variant 1: simple key-value
  I18n.t('hello', 'Hello.'); // => Hello.

  // Variant 2: using a variable
  I18n.t('hello', 'Hello %{name}.', {
    name: 'Ahmad'
  }); // => Hello Ahmad.

  // BAD: don't do this!
  I18n.t('hello', {
    defaultValue: 'Hello %{name}.',
    name: 'Ahmad'
  }); // => Hello %{name}Ahmad.

  // BAD: don't do this!
  var t = I18n.t;
  t('hello', 'Hello.');
  // raises an error, either use I18n.t directly as shown above, or:
  t = I18n.t.bind(I18n);
});
```

## License

Released under the AGPLv3 license, like [Canvas](http://github.com/instructure/canvas-lms).