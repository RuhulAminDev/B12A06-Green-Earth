# Assignment Questions & Answers

### 1) What is the difference between `var`, `let`, and `const`?

- **var**

  - Function-scoped (available only inside the function where it is declared).
  - Can be re-declared and updated.
  - Hoisted with `undefined`.

- **let**

  - Block-scoped (available only inside the block `{}` where it is declared).
  - Cannot be re-declared in the same scope, but can be updated.
  - Hoisted but not initialized (gives "Temporal Dead Zone" error if used before declaration).

- **const**

  - Block-scoped like `let`.
  - Cannot be re-declared or updated (value stays constant).
  - Must be initialized at the time of declaration.

  ### 2) What is the difference between `map()`, `forEach()`, and `filter()`?

- **map()**

  - Returns a **new array** with transformed values.
  - Always returns something.
  - Example: doubling all numbers in an array.

- **forEach()**

  - Iterates over each element but does **not return** a new array.
  - Used when we only want to perform side-effects like logging or updating values.

- **filter()**

  - Returns a **new array** with elements that pass the given condition.
  - Example: getting only even numbers from an array.

### 3) What are arrow functions in ES6?

- Arrow functions are a shorter syntax for writing functions introduced in ES6.  
- They do not have their own `this` context (lexical `this` binding).  

Example:
 js

function add(a, b) {
  return a + b;
}

const add = (a, b) => a + b;

### 4) How does destructuring assignment work in ES6?

- Destructuring allows us to unpack values from arrays or properties from objects into separate variables.

Example with arrays:

        const numbers = [10, 20, 30];
        const [a, b, c] = numbers;
Example with objects:

        const person = { name: "Ruhul", age: 22 };
        const { name, age } = person;

### 5) Explain template literals in ES6. How are they different from string concatenation?

- Template literals use backticks (`) instead of quotes.

- They allow embedding variables and expressions using ${}.

- They support multi-line strings easily.

Example:
        const name = "Ruhul";
        const age = 22;
        const str1 = "My name is " + name + " and I am " + age + " years old.";

        const str2 = `My name is ${name} and I am ${age} years old.`;

Difference:
- Concatenation uses + operator, template literals use ${} inside backticks.

- Template literals are more readable, especially for multi-line strings.