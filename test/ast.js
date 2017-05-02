let InputStream = require('../src/InputStream.js');
let Parser = require('../src/Parser.js');
let Token = require('../src/Token.js');

var ast = new Parser(new Token(new InputStream('123.5;')));

console.dir(ast);

var ast = new Parser(new Token(new InputStream('"Hello World!"')));

console.dir(ast);

var ast = new Parser(new Token(new InputStream('true')));

console.dir(ast);

var ast = new Parser(new Token(new InputStream('test')));

console.dir(ast);

var ast = new Parser(new Token(new InputStream(`
lambda (x) 10
`)));

console.dir(ast);
