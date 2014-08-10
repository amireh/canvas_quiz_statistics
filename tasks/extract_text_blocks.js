/* jshint node: true */
var _ = require('lodash');
var cheerio = require('cheerio');

var underscoreStr = function(str) {
  return str.replace(/([A-Z])/g, function($1){
    return '_' + $1.toLowerCase();
  });
};

var I18N_DIRECTIVE = _.template(
  'I18n.t("<%= phrase %>", "<%= defaultValue %>", <%= options %>);'
);

var TRANSFORMED_TEXT = _.template(
  '<div dangerouslySetInnerHTML={{ __html: <%= i18nDirective.replace(/;$/, "") %> }} />'
);

// Locates a <Text>...</Text> tag and captures its contents:
var TEXT_TAG_START = /<Text[^>]+>/m;
var TEXT_TAG_END = '</Text>';
var VERBOSE = process.env.VERBOSE;

// Capture all attribute tags inside the opening <Text> tag. E.g:
//
//     <Text scope="foo" name="Ahmad">...</Text>
//
// Yields a capture:
//
//     scope="foo" name="Ahmad"
var TEXT_PROPS_EXTRACTOR = /<Text([^>]+)>/;

// Locates the leading <Text> and trailing </Text>:
var TEXT_TAG_STRIPPER = /^<Text[^>]+>|<\/Text>$/g;

var padArray = function(original, offset, pad) {
  return [].concat(
    original.slice(0, offset),  // before part
    Array(pad).join(' '),       // the padding
    original.slice(offset)      // the "after" part
  );
};

/**
 * Given a <Text>...</Text> component string, this method will extract several
 * i18n items and construct an I18n.t() directive that would work in Canvas.
 *
 * Note: you should not use this directly, use #extractTextBlocks() instead as
 * it takes care of extracting all blocks in a given source string.
 *
 * @param  {String} textBlock
 *         A string containing a *single* <Text>...</Text> React component.
 *
 * @return {Object} i18n
 * @return {String} i18n.scope
 *         The i18n scope; what you use in `require([ "i18n!... ])`
 *
 * @return {String} i18n.phrase
 *         The phrase you're translating; the "name" in `I18n.t("name")`.
 *
 * @return {String} i18n.defaultValue
 *         The text or HTML contents of the <Text> component. Beware that this
 *         is not ready for injecting into an I18n.t() call as it requires
 *         wrapping. See #wrap()
 *
 * @return {Object} i18n.options
 *         Any options passed to the <Text/> component will be referenced here,
 *         such as "context", "count", or any variables the phrase will be
 *         interpolating.
 *
 * @return {String} i18n.stringValue
 *         The full call to I18n.t() with the proper phrase, its default value,
 *         and any options. This can be `eval()`d inside a Canvas environment
 *         and it would yield the proper value.
 */
var extract = function(textBlock) {
  var getScope = function(params) {
    return params.filter(function(prop) {
      return prop.key === 'scope';
    }).map(function(scopeProp) {
      return scopeProp.value;
    })[0];
  };

  var getParams = function(tag) {
    return tag
      .replace(/\s+/g, ' ')
      .trim()
      .split(' ')
      .map(function(prop) {
        return prop.trim().replace(/"/g, '').split('=');
      })
      .map(function(fragments) {
        return {
          key: fragments[0].trim(),
          value: fragments[1].trim()
        };
      });
  };

  var normalizeStr = function(str) {
    return str.replace(/"/g, '\\"');//.replace(/\n+/g, ' ');
  };

  /**
   * Generate the options parameter to use in the I18n.t() directive.
   *
   * @param  {Object} options
   *         The tag attributes you extracted from the starting <Text> docstring.
   *
   * @note
   * This gets really trippy when we're passing values for interpolation in React.
   * For example, to pass a "name" option to the <Text /> component, you would do
   * something like this:
   *
   *     <Text name="Ahmad" /> // OR, much more likely:
   *     <Text name={this.props.name} />
   *
   * Because of the second form, this method will not produce valid JSON, e.g,
   * you can't "eval()" it unless you're inside the context in which the <Text />
   * definition was done because it needs access to {this.props.name} to
   * evaluate.
   *
   * @return {String}
   *         The objects in a serialized notation, can be eval()d or written to
   *         an I18n.t() directive string.
   */
  var dumpOptions = function(options) {
    return JSON.stringify(options).replace(/\"\{|\}\"/g, '');
  };

  var i18n = {
    scope: null,
    phrase: null,
    defaultValue: null,
    stringValue: '',
    options: {}
  };

  var textTagStart = textBlock.match(TEXT_PROPS_EXTRACTOR)[1];
  var tagParams = getParams(textTagStart);
  var i18nPath = getScope(tagParams).split('.');
  var i18nParams = tagParams.filter(function(prop) {
    return prop.key !== 'scope';
  }).reduce(function(set, entry) {
    set[underscoreStr(entry.key)] = entry.value;
    return set;
  }, {});

  i18n.path = i18nPath.join('.');
  i18n.phrase = i18nPath.pop();
  i18n.scope = i18nPath.join('.');
  i18n.options = i18nParams;
  i18n.defaultValue = textBlock
    .replace(TEXT_TAG_STRIPPER, '') // remove <Text ...> and </Text>
    .replace(/[\n\s]+/g, ' ')       // no newlines, use spaces instead
    .trim();

  // Generate the actual I18n.t() directive
  i18n.stringValue = I18N_DIRECTIVE({
    phrase: i18n.phrase,
    defaultValue: normalizeStr(i18n.defaultValue),
    options: dumpOptions(i18n.options)
  });

  if (process.env.VERBOSE) {
    console.log(i18n);
    console.log(i18n.stringValue);
  }

  return i18n;
};

var extractTextBlocks = function(content) {
  var block;
  var cursor = 1;
  var charsConsumed = 0;
  var output = [];
  var begin, end, textItem;

  content = String(content);

  while (cursor > -1) {
    cursor = content.search(TEXT_TAG_START);

    if (cursor > -1) {
      begin = cursor;
      end = content.indexOf(TEXT_TAG_END) + TEXT_TAG_END.length;
      block = content.substring(begin, end);

      textItem = extract(block);
      textItem.offset = [ charsConsumed + begin, charsConsumed + end ];

      output.push(textItem);
    } else {
      break;
    }

    content = content.substr(begin + block.length);
    charsConsumed += begin + block.length;
  }

  return output;
};

var transform = function(contents) {
  var textBlocks = extractTextBlocks(contents);
  var padding = 0;

  if (textBlocks.length) {
    contents = contents.split('');
    textBlocks.forEach(function(block) {
      var oldCharCount, newCharCount, charCountDelta;
      var offset = block.offset;
      var i;

      var begin = padding + offset[0];
      var end   = padding + offset[1];
      var transformedDOM = TRANSFORMED_TEXT({
        i18nDirective: block.stringValue
      });

      oldCharCount = offset[1] - offset[0];
      newCharCount = transformedDOM.length;

      // Need to know how many characters we'll be adding, or popping, so that
      // we properly pad the offsets of the successive text transformations, if
      // any.
      charCountDelta = newCharCount - oldCharCount;

      // Clear the original <Text /> tag and its content:
      for (i = begin; i < end; ++i) {
        contents[i] = '';
      }

      if (charCountDelta > 0) {
        // we're pushing more chars than there originally was
        padding += charCountDelta;

        contents = padArray(contents, begin, charCountDelta);
      }
      else {
        // we're popping some chars
        padding -= charCountDelta;
      }

      // Write the new transformed content:
      for (i = begin; i < begin + newCharCount; ++i) {
        contents[i] = transformedDOM[i - begin];
      }

      if (VERBOSE) { console.log('Padding: [%d]', padding); }
    });

    contents = contents.join('');
  }

  return contents;
};

var extractWrappers = function(html) {
  // var $ = cheerio.load(html);
  var wrapper = {};
  var stringValue = '';

  var TAG_NAME = "[a-z][a-z0-9]*";
  var TAG_START = new RegExp('<(' + TAG_NAME + ')[^>]*(?!/)>', 'i');
  var tagStack = [];
  var charsConsumed = 0;

  var wrapTag = function(tag, input, allWrappers) {
    if (!tag) {
      return input;
    }

    allWrappers = allWrappers || {};

    var tagEndPosition = input.indexOf(tag.closingStr, tag.index);
    var chars;
    var wrapper, i, repl;
    var begin;
    var end;
    var charCountDelta;
    var tagContent;
    var asterisks;

    if (tagEndPosition > -1) {
      begin = tag.index;
      end = tagEndPosition + tag.closingStr.length;
      tagContent = input.substring(begin + tag.tag.length, tagEndPosition);
      asterisks = Array(tagStack.length + 2).join('*');

      // Create the starting * wrapper:
      wrapper = asterisks;

      // Keep the content of the tag:
      wrapper += tagContent;

      // Create the closing * wrapper:
      wrapper += asterisks;

      charCountDelta = wrapper.length - (end - begin);
      chars = input.split('');

      if (VERBOSE) {
        console.log('Handling tag <%s> at [%d, %d] (%s)',
          tag.tagName,
          begin,
          end,
          input.substring(begin, end));
      }

      if (charCountDelta > 0) {
        chars = padArray(chars, end, charCountDelta);
        end = end + charCountDelta;
      }

      for (i = begin, repl = 0; i < end; ++i, ++repl) {
        if (tag.tagName === 'a') {
          console.log('Substituting %s with %s [%d]', chars[i], wrapper[repl] || '', i);
        }
        chars[i] = wrapper[repl] || '';
      }

      allWrappers[asterisks] = tag.openingStr + '$1' + tag.closingStr;
      input = chars.join('');
    } else {
      console.warn('Closing tag for <%s> at [%d] could not be located.',
        tag.tagName, tag.index);
    }

    return wrapTag(tagStack.pop(), input, allWrappers);
  };

  var extractTag = function(str) {
    var cursor, charCount;
    var match = str.match(TAG_START);

    if (!match) {
      console.log('No more tags found.');
      return;
    }

    cursor = match.index;
    charCount = match[0].length;

    tagStack.push({
      tag: match[0],
      openingStr: match[0],
      closingStr: '</' + match[1] + '>',
      tagName: match[1],
      index: charsConsumed + cursor
    });

    charsConsumed += cursor + charCount;

    return extractTag(str.substring(cursor + charCount));
  };

  extractTag(html);
  stringValue = wrapTag(tagStack.pop(), html, wrapper);

  return {
    stringValue: stringValue,
    wrapper: wrapper
  };
};

module.exports = extractTextBlocks;
module.exports.transform = transform;
module.exports.extractWrappers = extractWrappers;