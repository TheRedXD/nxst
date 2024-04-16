# nxst - A simple module to help with the infamous function nesting problem.

nxst (a combination of the words next and nest) is a fairly simple module to solve the infamous JavaScript function nesting issue.

This module is notoriously simple, but I found it useful, so ¯\\_(ツ)_/¯

### What does it do?
nxst allows you to easily nest multiple functions together. Normally, you would have to write something like this:
```js
console.log(5, ((a) => {return a})("Hello, world!")); // Prints: 5 Hello, world!

// Note, the code above is not meant to be used in a real scenario - this is an example. This module may be useful in larger codebases, where nesting like this can make code very hard to read.
```
nxst allows you to write something like this:
```js
import nest from "nxst";

nest()
.add(console.log, 5)
.add((a) => {return a}, "Hello, world!")
.execute(); // Prints: 5 Hello, world!
// This is now significantly easier to read and follow - and it works!
```
In the case that you want to change the position of where the last function is placed, you can simply call nest().insert
```js
import nest from "nxst";

nest()
.add(console.log, nest().insert, 5)
.add((a) => {return a}, "Hello, world!")
.execute(); // Prints: Hello, world! 5
```
And yes, it also works with multiple inserts, if you need that for whatever reason. Go ahead and try it!

### How does it work?
Ok, let's say you still don't understand what it does and how it actually works.

nest() creates a new Nest class, which will let you add functions, which will get put inside of each other.

Example:
```js
import nest from "nxst";

// This:
nest()
.add(x)
.add(y)
.execute();

// Is equivalent to this:
x(y())
```

The first argument of the .add() function is always a function, then the rest are any arguments you want to supply to the function you provided.
```js
import nest from "nxst";

nest()
.add(x, 5) // this adds a function with an extra space - x(5, _)
.add(y) // the output of y() goes into the place of the underscore.
.execute();
```

If you want to change the location of where this output goes, you can use nest().insert at that location.

```js
import nest from "nxst";

nest()
.add(x, nest().insert, 5) // this will now be x(_, 5)
.add(y) // the output of y() goes into the place of the underscore.
.execute();
```

### What happens upon execution?
Let's say we have the following example code:
```js
import nest from "nxst";

nest()
.add(x, nest().insert, 5)
.add(y)
.execute();
```
Before doing any execution, when you add a function to a nest, it is added to an array.

Upon trying to execute this, it will read the array __backwards__ - this means y() gets ran first, then the output is provided to the insert position (or positions), and it recurses until there is nothing left.

This means:

1. `y()` is ran first
2. The returned value is provided to x: `x(y(), 5)` (except y already had its value computed)
3. This process recurses until we went through the full nest. For our example here, this is already done - we ran everything we needed to run.
4. The entire return value is provided as a return value of .execute().

## How do I install nxst?
Ok, let's say I convinced you to use this module. Maybe you're a beginner, and have no clue how to install a node module.

Generally, you're going to be using the NPM package manager for Node.js.

You're gonna want to simply run this in your terminal, while inside your project directory:

`npm install nxst`

If you use yarn:

`yarn add nxst`

If you use pnpm:

`pnpm install nxst`

Then there is no real other setup, other than a simple import:

```js
// EcmaScript (type: "module" in the package.json)
import nest from "nxst";

// CommonJS (type: "commonjs" in the package.json, or no type at all)
const nest = require("nxst");
```

Voila! Now you can use nxst.