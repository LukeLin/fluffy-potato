class Environment {
    constructor(parent) {
        this.vars = Object.create(parent ? parent.vars : null);
        this.parent = parent;
    }

    extend() {
        return new this.constructor(this);
    }

    lookup(name) {
        let scope = this;
        while (scope) {
            if (Object.prototype.hasOwnProperty.call(scope.vars, name))
                return scope;

            scope = scope.parent;
        }
    }

    get(name) {
        if (name in this.vars)
            return this.vars[name];

        throw Error(`Undefined variable ${name}`);
    }

    set(name, value) {
        let scope = this.lookup(name);
        // let's not allow defining globals from a nested environment
        if (!scope && this.parent)
            throw Error(`Undefined variable ${name}`);

        return (scope || this).vars[name] = value;
    }

    def(name, value) {
        return this.vars[name] = value;
    }
}

module.exports = Environment;
