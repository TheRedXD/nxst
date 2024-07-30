'use strict';

/**
 * @description An empty class to use as a placeholder for a function insertion (this way we can just check if the class is an instance of ElementInsert, instead of checking against some kind of special format/string or etc).
 */
class ElementInsert { constructor() {} }

/**
 * @description Is a collection of any elements, which can be later spread out automatically by nxst.
 */
class ElementCollection {
    constructor(...elements) {
        this.elements = elements;
    }
    add(element) {
        this.elements.push(element);
    }
    get() {
        return this.elements;
    }
    flat() {
        return this._recurse_flat(this.elements);
    }
    _recurse_flat(elements) {
        for (let i = 0; i < elements.length; i++) {
            let element = elements[i];
            if (element instanceof ElementCollection) {
                let acquiredElements = this._recurse_flat(element.get());
                elements.splice(i, 1, ...acquiredElements);
            }
        }
        return elements;
    }
}

/**
 * @description A nest of functions to solve the infamous function inside function problem.
 * @example
 * // Instead of doing this:
 * console.log(5, ((a) => {return a})("Hello, world!")); // Prints: 5 Hello, world!
 *
 * // You can do this:
 * nest()
 * .add(console.log, 5)
 * .add((a) => {a}, "Hello, world!")
 * .execute(); // Prints: 5 Hello, world!
 *
 * // Note: this code is useless by itself, it only serves as an example! nest() may be used in larger codebases, where this type of problem is significantly more common (and also each instance is larger), and makes code harder to read - that's where nest() is supposed to come in.
 */
class Nest {
    constructor() {
        this._nest = [];
        this.insert = new ElementInsert();
    }
    /**
     * @param  {...any} elements Any arguments to the function.
     * @returns {ElementCollection}
     * @description Creates a new collection, which can be spread out later by nxst (similar to doing ...[1, 2, 3] on an array).
     * @example
     * nest()
     * .add(console.log, 5)
     * .add((a) => nest().spread("Hello, world!", a, "How are you?"))
     * .add(() => "Text in the middle!")
     * .execute(); // Prints: 5 Hello, world! Text in the middle! How are you?
     */
    spread(...elements) {
        return new ElementCollection(...elements);
    }
    /**
     * @param {Function} fn Any function.
     * @param  {...any} args Any arguments to the function. Can include an insert, that is, `nest().insert`. Note: arguments aren't required!
     * @returns this
     * @description Adds a function to the nest, which will be called later (the nest is called from end to start).
     * @example
     * nest()
     * .add(console.log, 5)
     * .add((a) => {a}, "Hello, world!")
     * .execute(); // Prints: 5 Hello, world!
     */
    add(fn, ...args) {
        if(typeof fn !== "function") throw new Error("Nest function must be of type Function!");
        let hasInsert = false;
        for (let i = 0; i < args.length; i++) {
            if(args[i] instanceof ElementCollection) {
                let flattened = args[i].flat();
                args.splice(i, 1, ...flattened);
            }
        }
        for (let i = 0; i < args.length; i++) {
            let item = args[i];
            if(item instanceof ElementInsert) {
                hasInsert = true;
                break;
            }
        }
        if(!hasInsert) args.push(this.insert);
        let generatedElement = { fn, args };
        this._nest.push(generatedElement);
        return this;
    }
    /**
     * @returns The output of the last executed (first element) command in the nest.
     * @description Executes the nest in backwards order (from last to first).
     */
    execute() {
        let lastCommandOutput = undefined;
        let extraArgs = [];
        for(let i = this._nest.length-1; i > -1; i--) {
            let item = this._nest[i];
            let args = [];
            let hasInsert = false;
            for(let j = 0; j < item.args.length; j++) {
                let e = item.args[j];
                if(e instanceof ElementInsert) {
                    hasInsert = true;
                    if(extraArgs.length === 0) {
                        if(i !== this._nest.length-1 && hasInsert) args.push(lastCommandOutput);
                    } else {
                        if(i !== this._nest.length-1 && hasInsert) args.push(...extraArgs);
                    }
                    continue;
                }
                args.push(e);
            }
            lastCommandOutput = item.fn(...args);
            if (lastCommandOutput instanceof ElementCollection) {
                extraArgs = lastCommandOutput.flat();
            } else {
                extraArgs = [];
            }
        }
        return lastCommandOutput;
    }

    // HELPER FUNCTIONS
    log(...args) {
        console.log(...args);
        return args;
    }
}

/**
 * @description Makes a new Nest of functions to solve the infamous function inside function problem.
 * @example
 * // Instead of doing this:
 * console.log(5, ((a) => {return a})("Hello, world!")); // Prints: 5 Hello, world!
 *
 * // You can do this:
 * nest()
 * .add(console.log, 5)
 * .add((a) => {a}, "Hello, world!")
 * .execute(); // Prints: 5 Hello, world!
 *
 * // Note: this code is useless by itself, it only serves as an example! nest() may be used in larger codebases, where this type of problem is significantly more common (and also each instance is larger), and makes code harder to read - that's where nest() is supposed to come in.
 *
 * @returns new Nest()
 */
function nest() { return new Nest() }

module.exports = nest;
