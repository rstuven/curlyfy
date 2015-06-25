var fs = require('fs');
var path = require('path');
var curlyfy = require('..');
var program = require('commander');
var product = require('../package.json')

program
  .version(product.version)
  .usage('[file] [options]')

  .option('-e --block-opening-exception <regexp>',
    'Regular expression used as exception for block opening curly brackets.')

  .option('-i --insert-semicolons',
    'Support JavaScript semicolon-less style gotchas.')

  .parse(process.argv);

var options = {};
[
  'blockOpeningException',
  'insertSemicolons'
].forEach(function(name) {
  options[name] = program[name];
});

if (program.args[0] != null) {
  var file = path.join(process.cwd(), program.args[0]);
  var stream = fs.createReadStream(file, {encoding: 'utf8'});
  readStream(stream);
} else {
  process.stdin.setEncoding('utf8');
  readStream(process.stdin);
}

function readStream(stream) {
  var source = '';
  stream.on('readable', function() {
    chunk = stream.read();
    if (chunk != null) {
      source += chunk;
    }
  });
  stream.on('end', function() {
    convert(source);
  });
}

function convert(source) {
  try {
    var result = curlyfy(source, options);
    process.stdout.write(result);
  } catch (err) {
    return process.stderr.write(err.stack);
  }
}
