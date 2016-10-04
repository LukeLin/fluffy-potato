import { Token } from './Token';

export class ParseException {
    constructor(){}

    static location(token){
        if(token === Token.EOF){
            return `the last line`;
        } else {
            return `"${ token.getText() }" at line ${ token.lineNumber }"`;
        }
    }
}