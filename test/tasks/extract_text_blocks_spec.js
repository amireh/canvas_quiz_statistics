var fs = require('fs');
var subject = require('../../tasks/extract_text_blocks');
var path = require('path');

var loadFixture = function(fileName) {
  return String(fs.readFileSync( __dirname + '/../fixtures/tasks/' + fileName ));
};

describe('Tasks.extractTextBlocks', function() {
  it('should work', function() {
    var fixture = loadFixture('extract_text_blocks_1.js');
    expect(subject(fixture).length).toEqual(1);
  });

  it('should extract the path, scope, and phrase', function() {
    var output = subject('<Text scope="foo.bar"></Text>')[0];
    expect(output.path).toEqual('foo.bar');
    expect(output.scope).toEqual('foo');
    expect(output.phrase).toEqual('bar');
  });

  it('should extract parameters', function() {
    var output = subject('<Text scope="foo.bar" articleUrl="http://www.google.com"></Text>')[0];

    expect(output.options).toEqual({
      article_url: 'http://www.google.com'
    });
  });

  it('should leave {parameters} untouched', function() {
    var output = subject('<Text scope="foo.bar" articleUrl={url}></Text>')[0];

    expect(output.options).toEqual({
      article_url: '{url}'
    });
  });

  describe('#stringValue', function() {
    it('should produce an I18n.t() call string', function() {
      var output = subject('<Text scope="foo.bar" articleUrl={url}></Text>')[0];

      expect(output.stringValue).toEqual('I18n.t("bar", "", {"article_url":url});');
    });

    it('should include de-interpolated strings', function() {
      var output = subject('<Text scope="foo.bar" articleUrl={url}>Click <a href="%{article_url}">here</a>.</Text>')[0];

      expect(output.stringValue).toEqual('I18n.t("bar", "Click <a href=\\\"%{article_url}\\\">here</a>.", {"article_url":url});');
    });
  });

  it('should work with multiple blocks', function() {
    var output = subject([
      'render: function() {',
        'return (',
          '<div>',
            '<Text scope="foo.x">X goes here.</Text>',
            '<Text scope="foo.y">Y goes there.</Text>',
          '</div>',
        ');',
      '}'
    ].join("\n"));

    expect(output.length).toBe(2);

    expect(output[0].path).toBe('foo.x');
    expect(output[0].defaultValue).toBe('X goes here.');
    expect(output[0].offset).toEqual([ 36, 36 + 39 ]);

    expect(output[1].path).toBe('foo.y');
    expect(output[1].defaultValue).toBe('Y goes there.');
    expect(output[1].offset).toEqual([ 76, 76 + 40 ]);
  });

  describe('#transform', function() {
    it('should work', function() {
      var input = loadFixture('transform.in.jsx');
      var output = loadFixture('transform.out.jsx');

      expect(subject.transform(input)).toEqual(output);
    });

    xit('works with multiple <Text /> components', function() {
      var input = loadFixture('transform_multi.in.jsx');
      var output = loadFixture('transform_multi.out.jsx');

      expect(subject.transform(input)).toEqual(output);
    });
  });

  describe('#extractWrappers', function() {
    it('should work', function() {
      var input = loadFixture('wrappers-2.in.html');
      var output = loadFixture('wrappers-2.out.html');
      var transformed = subject.extractWrappers(input);

      expect(transformed.stringValue).toEqual(output);
      expect(transformed.wrapper['*']).toEqual('<p>$1</p>');
      expect(transformed.wrapper['**']).toEqual('<span>$1</span>');
      expect(transformed.wrapper['***']).toEqual('<span>$1</span>');
      expect(transformed.wrapper['****']).toEqual('<a href="http://google.com">$1</a>');
      expect(transformed.wrapper['*****']).toEqual('<iframe src="%{page_url}">$1</iframe>');
    });

    it('should work with a complicated DOM', function() {
      var input = loadFixture('wrappers.in.html');
      var output = loadFixture('wrappers.out.html');
      var transformed = subject.extractWrappers(input);

      expect(transformed.stringValue).toEqual(output);
      expect(transformed.wrapper['*']).toEqual('<p>$1</p>');
      expect(transformed.wrapper['**']).toEqual('<p>$1</p>');
      expect(transformed.wrapper['***']).toEqual('<p>$1</p>');
      expect(transformed.wrapper['****']).toEqual('<a href="%{article_url}" target="_blank">$1</a>');
    });

    it('should work with nested tags', function() {
      var output;
      var input = [
        '<p>',
          '<span id="one">Hi',
            '<span id="two">%{name}</span>',
          '</span>',
        '</p>'
      ].join('\n');

      output = subject.extractWrappers(input);
      expect(output.stringValue).toEqual([
        '*',
          '**Hi',
            '***%{name}***',
          '**',
        '*'
      ].join('\n'));

      expect(output.wrapper['*']).toEqual('<p>$1</p>');
      expect(output.wrapper['**']).toEqual('<span id="one">$1</span>');
      expect(output.wrapper['***']).toEqual('<span id="two">$1</span>');
    });

    it('should keep the tag attributes', function() {
      var output;
      var input = [
        '<a href="http://google.com">Click me</a>'
      ].join('\n');

      output = subject.extractWrappers(input);
      expect(output.wrapper['*']).toEqual('<a href="http://google.com">$1</a>');
    });
  });
});