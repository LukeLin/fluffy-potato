import Token from './Token';

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
    addToken(lineNo, matcher){}
}