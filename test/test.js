var assert = require('assert')
var curlyfy = require('..');

test('different indentation sizes', function () {
  var actual = curlyfy([
     ' a'
    ,'     b'
    ,'        c'
    ,'          d'
    ,'          e'
    ,'     f'
  ].join('\n'));
  var expected = [
     ' a {'
    ,'     b {'
    ,'        c {'
    ,'          d'
    ,'          e'
    ,'        }'
    ,'     }'
    ,'     f'
    ,' }'
  ].join('\n');
  assert.equal(actual, expected);
});

test('expected indentation error', function () {
  assert.throws(function() {
    var actual = curlyfy([
       '  a'
      ,'      b'
      ,'    c'
    ].join('\n'));
  }, function(err) {
    assert.equal(err.toString(), 'Error: Line 3 - Wrong indentation size: 4. Expected size: 2.');
    return true;
  });
});

test('lower indentation size error', function () {
  assert.throws(function() {
    var actual = curlyfy([
       '    a'
      ,'  b'
    ].join('\n'));
  }, function(err) {
    assert.equal(err.toString(), 'Error: Line 2 - Wrong indentation size: 2. All previous sizes were higher.');
    return true;
  });
});

test('trailing opening curly bracket', function () {
  var actual = curlyfy([
     ' a = {   ' // trailing spaces
    ,'  b: c'
    ,' }'
  ].join('\n'));
  var expected = [
     ' a = {   '
    ,'  b: c'
    ,' }'
  ].join('\n');
  assert.equal(actual, expected);
});

test('trailing opening square bracket', function () {
  var actual = curlyfy([
     ' a = [   ' // trailing spaces
    ,'  b,'
    ,'  c'
    ,' ]'
    ,' if (x)'
    ,'   break'
    ,' doX(['
    ,'  ['
    ,'   1'
    ,'   ]'
    ,'   ])'
  ].join('\n'));
  var expected = [
     ' a = [   '
    ,'  b,'
    ,'  c'
    ,' ]'
    ,' if (x) {'
    ,'   break'
    ,' }'
    ,' doX(['
    ,'  ['
    ,'   1'
    ,'   ]'
    ,'   ])'
  ].join('\n');
  assert.equal(actual, expected);
});

test('trailing open parentheses', function () {
  var actual = curlyfy([
     ' fn(  ' // trailing spaces
    ,'  a,'
    ,'  b,'
    ,'  c)'
  ].join('\n'));
  var expected = [
     ' fn(  '
    ,'  a,'
    ,'  b,'
    ,'  c)'
  ].join('\n');
  assert.equal(actual, expected);
});

test('trailing comma', function () {
  var actual = curlyfy([
     ' fn(a,  ' // trailing spaces
    ,'  b,'
    ,'  c)'
  ].join('\n'));
  var expected = [
     ' fn(a,  '
    ,'  b,'
    ,'  c)'
  ].join('\n');
  assert.equal(actual, expected);
});

test('insert before closing parens', function () {
  var actual = curlyfy([
     '  fn((x) =>'
    ,'     return x'
    ,'  ), (y) =>'
    ,'   return y'
    ,'  )'
  ].join('\n'));
  var expected = [
     '  fn((x) => {'
    ,'     return x'
    ,'  }), (y) => {'
    ,'   return y'
    ,'  })'
  ].join('\n');
  assert.equal(actual, expected);
});

test('tab indentations', function () {
  var actual = curlyfy([
     '\ta'
    ,'\t\tb'
    ,'\t\t\tc'
    ,'\t\t\td('
    ,'\t\t\t\te'
    ,'\t\t\t\t)'
    ,'\t\tf'
  ].join('\n'));
  var expected = [
     '\ta {'
    ,'\t\tb {'
    ,'\t\t\tc'
    ,'\t\t\td('
    ,'\t\t\t\te'
    ,'\t\t\t\t)'
    ,'\t\t}'
    ,'\t\tf'
    ,'\t}'
  ].join('\n');
  assert.equal(actual, expected);
});

test('no semicolons insertion by default', function () {
  var actual = curlyfy([
     '  ++i'
  ].join('\n'));
  var expected = [
     '  ++i'
  ].join('\n');
  assert.equal(actual, expected);
});

test('semicolons insertion', function () {
  var actual = curlyfy([
     '  ++i'
    ,'  --i'
    ,'  (x || y).doSomething()'
    ,'  [a, b, c].forEach(doSomething)'
  ].join('\n'), {insertSemicolons: true});
  var expected = [
     '  ;++i'
    ,'  ;--i'
    ,'  ;(x || y).doSomething()'
    ,'  ;[a, b, c].forEach(doSomething)'
  ].join('\n');
  assert.equal(actual, expected);
});

test('bonus: implicit object literal and safer return ftw!', function () {
  var actual = curlyfy([
     'return'
    ,'  a: 1,'
    ,'  b: 2'
  ].join('\n'));
  var expected = [
     'return {'
    ,'  a: 1,'
    ,'  b: 2'
    ,'}'
  ].join('\n');
  assert.equal(actual, expected);
});
