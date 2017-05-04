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

console.dir(ast, {
    showHidden: true,
    depth: null
});

console.log('\n');
var ast = new Parser(new Token(new InputStream(`
foo(a, 1)  # comment
`)));

console.dir(ast, {
    showHidden: true,
    depth: null,
    colors: true
});

console.log('\n');
var ast = new Parser(new Token(new InputStream(`
if foo then bar else baz
`)));

console.dir(ast, {
    showHidden: true,
    depth: null,
    colors: true
});

console.log('\n');
var ast = new Parser(new Token(new InputStream(`
a = 10
`)));

console.dir(ast, {
    showHidden: true,
    depth: null,
    colors: true
});

console.log('\n');
var ast = new Parser(new Token(new InputStream(`
a + b * c
`)));

console.dir(ast, {
    showHidden: true,
    depth: null,
    colors: true
});

console.log('\n');
var ast = new Parser(new Token(new InputStream(`
{
  a = 5;
  b = a * 2;
  a + b;
}
`)));

console.dir(ast, {
    showHidden: true,
    depth: null,
    colors: true
});
