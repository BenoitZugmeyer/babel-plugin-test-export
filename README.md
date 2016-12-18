# babel-plugin-test-export

[![Build Status](https://travis-ci.org/BenoitZugmeyer/babel-plugin-test-export.svg?branch=master)](https://travis-ci.org/BenoitZugmeyer/babel-plugin-test-export)

Export private variables and functions to your tests. Annotate variable and function declarations
with a `// @test-export` comment and they will be exported in a `__test__` property of the module.
Use values exported like this to write more focused tests or to mock things.

## Install

```
$ yarn add --dev babel-plugin-test-export
```

Make sure to add this plugin only for tests. Example, in your `.babelrc`:
```js
{
  // ... your common configuration ...
  env: {
    test: {
      plugins: [ "test-export" ]
    }
  }
}
```

## Example

`mylib.js`:
```js
// @test-export
function appendFoo(str) {
    return str + "foo"
}

module.exports = function (str) {
    return appendFoo(str).toUpperCase()
}
```

`mylibSpec.js` (`jasmine` example):
```js
const mylib = require("./mylib")

// Test private functions!
describe("appendFoo", () => {
    const { appendFoo } = mylib.__test__
    it("appends foo", () => {
        expect(appendFoo("a")).toBe("afoo")
    })
})

// Mock private functions!
describe("mylib", () => {
    it("appends foo and turn value in uppercase", () => {
        spyOn(mylib.__test__, "appendFoo")
        expect(mylib("a")).toBe("AFOO")
        expect(mylib.__test__.appendFoo).toHaveBeenCalled()
    })
})

```

## How it works

All references of the annotated variables and functions are rewritten to use the exported reference
instead.  The above example is rewritten as:

```js
const __test__ = {};

// @test-export
__test__.appendFoo = function appendFoo(str) {
    return str + "foo";
};

module.exports = function (str) {
    return __test__.appendFoo.call(undefined, str).toUpperCase();
};
module.exports.__test__ = __test__
```

## Drawbacks

* Currently, it only works with commonjs exported modules.
* Function and variable declarations are not hoisted anymore, so make sure to always write
  declarations before using them.

## Inspiration and thanks

I used [babel-strip-test-code](https://github.com/madole/babel-strip-test-code) as a start to write
this plugin.  Its goal is quite similar: export private values via a `export __test__ = { ... }` and
it will strip this export for you in production.  This approach, while quite simpler than mine,
is a bit more verbose and doesn't allow mocks.
