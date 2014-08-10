/* jshint node: true */
var _ = require('lodash');
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
// var VERBOSE = process.env.VERBOSE;

// Capture all attribute tags inside the opening <Text> tag. E.g:
//
//     <Text scope="foo" name="Ahmad">...</Text>
//
// Yields a capture:
//
//     scope="foo" name="Ahmad"
var TEXT_PROPS_EXTRACTOR = /<Text([^>]+)>/;

// Locates the leading <Text> and trailing </Text>:
var TEXT_TAG_STRIPPER = /^<Text>|<\/Text>$/g;

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

var dumpOptions = function(options) {
  return JSON.stringify(options).replace(/\"\{|\}\"/g, '');
};

var extract = function(textBlock) {
  var i18n = {
    scope: null,
    phrase: null,
    defaultValue: null,
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
    .replace(textTagStart, '')
    .trim()
    .replace(TEXT_TAG_STRIPPER, '')
    .replace(/[\n\s]+/g, ' ')
    .trim();

  // i18n.stringValue =
  //   'I18n.t("' + i18n.phrase + '", ' +
  //     '"' + normalizeStr(i18n.defaultValue) + '", ' +
  //     dumpOptions(i18n.options) +
  //   ');';

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

  function padArray(original, offset, pad) {
    var beforePart = original.slice(0, offset);
    var afterPart = original.slice(offset);
    var newPart = Array(pad).join(' ');
    return [].concat(beforePart).concat(newPart).concat(afterPart);
  }

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

      console.log('Padding: [%d]', padding);
    });

    contents = contents.join('');
  }

  return contents;
};

module.exports = extractTextBlocks;
module.exports.transform = transform;