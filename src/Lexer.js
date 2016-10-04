import {
    Token,
    NumToken,
    StrToken,
    IdToken
} from './Token';

const digitReg = /\d+/;
const identyReg = /[A-Za-z][A-Za-z0-9]*/;
const strReg = /"("|\\|\n|[^"])"/;
const regexp = new RegExp('\\s*((//.*)|(\d+)|("(\\\\"|\\\\\\\\|\\\\n|[^\"])*")|[A-Za-z][A-Za-z0-9]*|==|<=|>=|&&|\\|\\||[!"#$%&\'\(\)*+,\-.\/\/:;<=>?@\[\]^_`{|}~]+)?', 'g');

export default class Lexer {
    constructor(reader){
        this.hasMore = true;
        this.reader = reader;
        this.queue = [];
    }

    read(){
        if(this.fillQueue(0))
            return this.queue.shift();
        else
            return Token.EOF;
    }

    /**
     *
     * @param {Number} i
     * @returns {*}
     */
    peek(i){
        if(this.fillQueue(0))
            return this.queue[i];
        else
            return Token.EOF
    }

    /**
     *
     * @param {Number} i
     * @returns {boolean}
     */
    fillQueue(i){
        while(i >= this.queue.length){
            if(this.hasMore) this.readLine();
            else return false;
        }

        return true;
    }

    readLine(){
        let line = this.reader.readLine();
        if(!line) {
            this.hasMore = false;
            return;
        }

        let lineNumber = this.reader.getLineNumber();
        let matcher = regexp.exec(line);
        let pos = 0;
        let endPos = line.length;

        while(pos < endPos){
            if(matcher) {
                this.addToken(lineNumber, matcher);
                pos = regexp.lastIndex;
            } else {
                throw new ParseException(`Bad token at line: ${ lineNumber }`);
            }
        }

        this.queue.push(new IdToken(lineNumber, Token.EOL));
    }

    /**
     *
     * @param {Number} lineNo
     * @param {Array} matcher
     */
    addToken(lineNo, matcher){
        let m = matcher[1];

        // 不是空格
        if(m){
            // 不是注释
            if(!matcher[2]){
                let token = null;
                if(matcher[3]){
                    token = new NumToken(lineNo, parseInt(m));
                } else if(matcher[4]){
                    token = new StrToken(lineNo, this.toStringLiteral(m));
                } else {
                    token = new IdToken(lineNo, m);
                }

                this.queue.push(token);
            }
        }        
    }

    toStringLiteral(s){
        let str = '';

        let len = s.length - 1;
        for(let i = 0; i < len; ++i){
            let c = s.charAt(i);

            if(c === '\\' && i + 1 < len){
                let c2 = s.charAt(i + 1);

                if(c2 === '"' || c2 === '\\'){
                    c = s.charAt(++i);
                } else if(c2 === 'n'){
                    ++i;
                    c = '\n';
                }
            }

            str += c;
        }

        return str;
    }
}