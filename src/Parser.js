const FALSE = {
    type: 'bool',
    value: false,
};
const PRECEDENCE = {
    '=': 1,
    '||': 2,
    '&&': 3,
    '<': 7,
    '>': 7,
    '<=': 7,
    '>=': 7,
    '==': 7,
    '!=': 7,
    '+': 10,
    '-': 10,
    '*': 20,
    '/': 20,
    '%': 20
};

export default class Parser {
    constructor(input) {
        this.input = input;

        let prog = [];
        while (!this.input.eof()) {
            prog.push(this.parseExpression());
            if (!this.input.eof()) this.skipPunc(';');
        }
        this.type = 'prog';
        this.prog = prog;
    }

    isPunc(ch) {
        let tok = this.input.peek();
        return tok && tok.type === 'punc' && (!ch || tok.value === ch);
    }

    isKw(kw) {
        let tok = this.input.peek();
        return tok && tok.type === 'kw' && (!kw || tok.value === kw);
    }

    isOp(op) {
        let tok = this.input.peek();
        return tok && tok.type === 'op' && (!op || tok.value === op);
    }

    skipPunc(ch) {
        if (this.isPunc(ch)) this.input.next();
        else this.input.croak(`Expecting punctuation: ${ ch }`);
    }

    skipKw(kw) {
        if (this.isKw(kw)) this.input.next();
        else this.input.croak(`Expecting keyword: ${ kw }`);
    }

    skipOp(op) {
        if (this.isOp(op)) this.input.next();
        else this.input.croak(`Expecting operator: ${ op }`);
    }

    unexpected() {
        this.input.croak(`Unexpected token: ${ JSON.stringify(this.input.peek()) }`);
    }

    maybeBinary(left, myPrec) {
        let tok = this.isOp();

        if (tok) {
            let hisPrec = PRECEDENCE[tok.value];
            if (hisPrec > myPrec) {
                this.input.next();

                return maybeBinary({
                    type: tok.value === '=' ? 'assign' : 'binary',
                    operator: tok.value,
                    left,
                    right: maybeBinary(this.parseAtom(), hisPrec)
                }, myPrec);
            }
        }

        return left;
    }

    delimited(start, stop, separator, parser) {
        let a = [];
        let first = true;

        this.skipPunc(start);
        while (!this.input.eof()) {
            if (this.isPunc(stop)) break;
            if (first) first = false;
            else this.skipPunc(separator);

            a.push(parser);
        }

        this.skipPunc(stop);

        return a;
    }

    parseCall(func) {
        return {
            type: 'call',
            func,
            args: this.delimited('(', ')', ',', this.parseExpression)
        };
    }

    parseVarname() {
        let name = this.input.next();
        if (name.type !== 'var') this.input.croak("Expecting variable name");
        return name.value;
    }

    parseIf() {
        this.skipKw('if');

        let cond = this.parseExpression();

        if (!this.isPunc('{')) this.skipKw('then');

        let then = this.parseExpression();
        let ret = {
            type: 'if',
            cond,
            then
        };

        if (this.isKw('else')) {
            this.input.next();
            ret.else = this.parseExpression();
        }

        return ret;
    }

    parseLambda() {
        return {
            type: 'lambda',
            vars: this.delimited('(', ')', ',', this.parseVarname),
            body: this.parseExpression()
        };
    }

    parseBool() {
        return {
            type: 'bool',
            value: this.input.next().value === 'true';
        };
    }

    mayBeCall(expr) {
        expr = expr();

        return this.isPunc('(') ? this.parseCall(expr) : expr;
    }

    parseAtom() {
        return maybeBinary(() => {
            if (this.isPunc('(')) {
                this.input.next();
                let exp = this.parseExpression();
                this.skipPunc(')');
                return exp;
            }
            if (this.isPunc('{')) return this.parseProg();
            if (this.isKw('if')) return this.parseIf();
            if (this.isKw('true') || this.isKw('false')) return this.parseBool();
            if (this.isKw('lambda') || this.isKw('λ')) {
                this.input.next();
                return this.parseLambda();
            }

            let tok = this.input.next();
            if (tok.type === 'var' || tok.type === 'num' || tok.type === 'str') return tok();

            this.unexpected();
        });
    }

    parseProg() {
        let prog = this.delimited('{', '}', ';', this.parseExpression);
        if (prog.length === 0) return FALSE;
        if (prog.length === 1) return prog[0];

        return {
            type: 'prog',
            prog
        };
    }

    parseExpression() {
        return this.mayBeCall(() => {
            return this.maybeBinary(this.parseAtom(), 0);
        });
    }
}