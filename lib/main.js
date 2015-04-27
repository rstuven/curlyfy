/**
 * curlyfy
 */
module.exports = function curlyfy(input, options) {
  if (options == null) {
    options = {};
  }

  var re = compileRegExps();

  var output = [];

  var block = {
    indent: null,
    indents: [],
    pairs: [],
    previousLine: null
  };

  var lines = input.split('\n');
  var linesCount = lines.length;
  var lineIndex = 0;
  while (lineIndex < linesCount) {
    var line = lines[lineIndex];
    try {
      readLine(output, line, options, re, block);
    } catch (err) {
      err.message = 'Line ' + (lineIndex + 1) + ' - ' + err.message;
      throw err;
    }
    ++lineIndex;
  }

  closePending(block, output);

  return output.join('');
};

function compileRegExps() {
  return {
    INDENTATION: /^[\s\t]*/,
    SPECIAL_CASES: /[{\[\(,][\s\t]*$/,
    PARENS_CLOSING: /^[\s\t]*(\).*)$/
  }
}

function readLine(output, line, options, re, block) {
  var indent = (re.INDENTATION.exec(line))[0];
  if (indent === block.indent) {
    append(output, line, indent, options);
  } else if (block.indent == null || indent.length > block.indent.length) {
    blockStart(block, output, line, indent, options, re);
  } else {
    blockStop(block, output, line, indent, re);
  }
  block.previousLine = line;
}

function append(output, line, indent, options) {
  if (output.length > 0) {
    output.push('\n');
  }
  var pos = indent.length;
  // support JavaScript semicolon-less style gotchas
  if (options.insertSemicolons === true && '([+-'.indexOf(line[pos]) !== -1) {
    output.push(line.substr(0, pos), ';', line.substr(pos));
  } else {
    output.push(line);
  }
}

function blockStart(block, output, line, indent, options, re) {
  if (block.indent != null) {
    block.indents.push(block.indent);
  }
  block.indent = indent;
  if (block.previousLine != null) {
    // don't open curly
    if (re.SPECIAL_CASES.test(block.previousLine)) {
      block.pairs.push(false);
    } else {
      // curlyfy!
      output.push(' {');
      block.pairs.push(true);
    }
  }
  append(output, line, indent, options);
}

function blockStop(block, output, line, indent, re) {
  while (true) {
    block.indent = block.indents.pop();
    if (block.indent == null) {
      throw new Error(
        'Wrong indentation size: ' + indent.length + '. ' +
        'All previous sizes were higher.');
    } else if (block.indent.length < indent.length) {
      throw new Error(
        'Wrong indentation size: ' + indent.length + '. ' +
        'Expected size: ' + block.indent.length + '.');
    }
    if (block.pairs.pop()) {
      // curlyfy!
      output.push('\n', block.indent, '}');
    }
    // back on track?
    if (block.indent.length === indent.length) {
      break;
    }
  }

  // nice formatting on parentheses closing
  var parens = re.PARENS_CLOSING.exec(line);
  if (parens == null) {
    output.push('\n', line);
  } else {
    output.push(parens[1]);
  }
}

function closePending(block, output) {
  var indent;
  while (block.indents.length > 0) {
    indent = block.indents.pop();
    if (block.pairs.pop()) {
      output.push('\n',  indent, '}');
    }
  }
}
