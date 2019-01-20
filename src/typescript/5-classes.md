@page typescript/classes Classes
@parent typescript 5

@description Classes in TypeScript

@body

## Classes in TypeScript

For those newer to Object-oriented programming, classes are special functions that help us abstract our code. Classes can define function expressions and function declarations.

In JavaScript, a class is a structured way to define what you may have seen before - prototype based functions. This allows us to take an object-oriented approach to building our JavaScript applications. 

@sourceref ./5-1-javascript-prototype.html
@codepen

In the TypeScript class example, the 'name' member is initialized on line 4. We'll look at setting the name via the constructor next. 
@sourceref ./5-2-typescript-class.html
@codepen
@highlight 4


### Constructor

The constructor method is how to create and initialize a new object with members. The constructor is used when we call a class with the ``new`` keyword, because it constructs and retuns a new object for us with properties we gave it.

@sourceref ./5-3-class-constructor.html
@codepen

When declaring members, it's also possible to instantiate a value on them.

@sourceref ./5-3-class-constructor-initialized.html
@codepen

Using the constructor to set public members is quite a common pattern, which is why TypeScript also provides a shorthand.

@sourceref ./5-4-constructor-short.html
@codepen

### Inheritance

Inheritance is a way to extend functionality of existing classes. If the devired class contains it's own constructor function, it MUST call a super method with params matching that of it's parent class. Super is a call to the parent constructor method to ensure the properties are set for the parent. The following shows accessing the move mehtod from the parent class and adding run and talk methods to the child class.

@sourceref ./5-5-inheritance.html
@codepen

### Statics

When you need a property to be shared across multiple instances, you can use static property. These are shared by all instances of the class as well as inheriting classes. Both members and methods on a class can be static. Each instance accesses the static value through prepending the name of the class.

@sourceref ./5-6-statics.html
@codepen


### Public modifier

In TypeScript all members are public by default, meaning they are publicly accessible.

@sourceref ./5-7-public.html
@codepen

### Private modifier

Members marked private are unable to be accessed from outside their containing class.

@sourceref ./5-8-private.html
@codepen

### Protected modifier

Protected modifiers are similar to private modifiers in that they can't be accessed but they CAN be accessed by deriving classes.

@sourceref ./5-9-protected.html
@codepen

### Readonly modifier

Readonly modifieds allow properties to be read, but not changed.

@sourceref ./5-10-readonly.html
@codepen

### Exercise 1

Open your editor create a new file ``hellodino.ts``, and recreate this prototype using TypeScript classes.

```typescript
function DinoKeeper(name) {
  this.name = name;
}

DinoKeeper.prototype.sayHi = function() {
  console.log(this.name + ' says "hi"');
}

let employee1 = new DinoKeeper("Joe");
employee1.sayHi();
//Joe says "hi"
```

Hint* When you run:

```bash
tsc hellodino.ts
```

Your code should output to look like the above prototype version!

<details>
<summary>Solution</summary>

```typescript
class DinoKeeper {
  name: string;

  constructor(name:string) {
    this.name = name;
  }

  sayHi() {
    console.log(`${this.name} says "hi"`);
  }
}
let employee1 = new DinoKeeper("Joe);
employee1.sayHi();
//Joe says "hi"
```
</details>

### Exercise 2

Create a new ``Specialist`` class that inherits from the ``DinoKeeper``. This new class class should be able to accept an additonal ``experience`` public member that is a number, and have a ``safetyQuote`` method that console.logs("Never turn your back to the cage. Trust me, I have _years_ years of experience")

<details>
<summary>Solution</summary>

```typescript
class Specialist extends DinoKeeper {
  constructor(name: string, public experience: number) {
    super(name);
  }

  safetyQuote() {
    console.log(`Never turn your back to the cage. Trust me, I have ${this.experience} years of experience`);

  }
}

let employee2 = new Specialist("Owen", 14);
employee2.sayHi(); //Owen says 'hi'
employee2.safetyQuote(); //Never turn your back to the cage. Trust me, I have 14 years of experience
```
</details>