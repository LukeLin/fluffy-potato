
export class Token {
    constructor(line){
        this.lineNumber = line;
    }

    isIdentifier(){

    }

    isNumber(){}

    isString(){}

    getText(){

    }
}
Token.EOF = new Token(-1);
Token.EOL = '\\n';