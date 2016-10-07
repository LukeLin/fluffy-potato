const KEY_WORDS = 'if then else lambda func true false';

function isKeyword(value){
    return KEY_WORDS.indexOf(` ${ value } `) >= 0;
}

function isDigit(value){
    return /\d/.test(value);
}

function isIdStart(value){
    return /[a-z_]/i.test(value);
}

function isId(value){
    return isIdStart(value) || '?!-<>=0123456789'.indexOf(ch) >= 0;
}

function isOpChar(value){
    return '+-*/%=&|<>!'.indexOf(value) >= 0;
}

function isPunc(value){
    return ',;(){}[]'.indexOf(value) >= 0;
}

function isWhitespace(value){
    return '\t\n'.indexOf(value) >= 0;
}

function nonWrap(value){
    return value !== '\n';
}


export default class Token {
    constructor(input = ''){
        this.input = input;
        this.current = null;
    }

    next(){
        let token = this.current;
        this.current = null;

        return token || this._readNext();
    }

    _readNext(){
        this._readWhile(isWhitespace);

        if(this.input.eof()) return null;

        let ch = this.input.peek();
        if(ch === '#'){
            this._skipComment();
            return this._readNext();
        }

        if(ch === '"') return this._readString();
        if(isDigit(ch)) return this._readNumber();
        if(isIdStart(ch)) return this._readIdent();
        if(isPunc(ch)) {
            return {
                type: 'punc',
                value: this.input.next()
            };
        }
        if(isOpChar(ch)){
            return {
                type: 'op',
                value: this._readWhile(isOpChar)
            };
        }

        this.input.croak(`Can't handle character: ${ ch }`);
    }

    _readWhile(predicate){
        let str = '';
        while(!this.input.eof() && predicate(this.input.peek())){
            str += this.input.next();
        }

        return str;
    }

    _skipComment(){
        this._readWhile(nonWrap);
    }

    _readString(){
        return {
            type: 'str',
            value: this._readEscaped('"')
        };
    }

    _readNumber(){
        let hasDot = false;
        let number = this._readWhile(function(ch){
            if(ch === '.') {
                if(hasDot) return false;
                hasDot = true;
                return true;
            }

            return isDigit(ch);
        });

        return {
            type: 'number',
            value: parseFloat(number)
        };
    }

    _readIdent(){
        let id = this._readWhile(isId);

        return {
            type: isKeyword(id) ? 'keyword' : 'variable',
            value: id
        };
    }

    _readEscaped(end){
        let escaped = false;
        let str = '';

        this.input.next();

        while(!this.input.eof()){
            let ch = this.input.next();

            if(escaped) {
                str += ch;
                escaped = false;
            } else if(ch === '\\'){
                escaped = true;
            } else if(ch === end){
                break;
            } else {
                str += ch;
            }
        }

        return str;
    }

    peek(){
        return this.current || (this.current = this._readNext());
    }

    eof(){
        return this.peek() == null;
    }

    croak(){
        return this.input.croak();
    }
}
