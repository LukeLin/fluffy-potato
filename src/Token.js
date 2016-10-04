
export class Token {
    constructor(line){
        this.lineNumber = line;
    }

    isIdentifier(){
        return false;
    }

    isNumber(){
        return false;
    }

    isString(){
        return false;
    }

    getText(){
        return '';
    }
}
Token.EOF = new Token(-1);
Token.EOL = '\\n';

export class NumToken extends Token {
    constructor(line, v){
        super(line);

        this.value = v;
    }

    isNumber(){
        return true;
    }

    getText(){
        return this.value + '';
    }

    getNumber(){
        return this.value;
    }
}

export class IdToken extends Token {
    constructor(line, id){
        super(line);

        this.text = id;
    }

    isIdentifier(){
        return true;
    }

    getText(){
        return this.text;
    }
}

export class StrToken extends Token {
    constructor(line, str){
        super(line);

        this.literal = str;
    }

    isString(){
        return true;
    }

    getText(){
        return this.literal;
    }
}
