/**
 * @description An empty class to use as a placeholder for a function insertion (this way we can just check if the class is an instance of ElementInsert, instead of checking against some kind of special format/string or etc).
 */
declare class ElementInsert {}

/**
 * @description Is a collection of any elements, which can be later spread out automatically by nxst.
 */
declare class ElementCollection {
    elements: Array<any>;
    constructor(...elements: any);
    add(element: any): void;
    get(): Array<any>;
    flat(): Array<any>;
    _recurse_flat(elements: Array<any>): Array<any>;
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
declare class Nest {
    _nest: Array<Object>;
    insert: ElementInsert;
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
    spread(...elements: any): ElementCollection;
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
    add(fn: Function, ...args: any): this;
    /**
     * @returns The output of the last executed (first element) command in the nest.
     * @description Executes the nest in backwards order (from last to first).
     */
    execute(): any;
    log(...args: any): any;
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
export default function nest(): Nest;