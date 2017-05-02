let InputStream = require('../src/InputStream.js');
let Parser = require('../src/Parser.js');
let Token = require('../src/Token.js');

var ast = new Parser(new Token(new InputStream('123.5;')));

console.dir(ast);
