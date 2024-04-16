/**
 * @description An empty class to use as a placeholder for a function insertion (this way we can just check if the class is an instance of ElementInsert, instead of checking against some kind of special format/string or etc).
 */
declare class ElementInsert {}

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
    add(fn: Function, ...args: any);
    /**
     * @returns The output of the last executed (first element) command in the nest.
     * @description Executes the nest in backwards order (from last to first).
     */
    execute();
    log(...args: any);
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