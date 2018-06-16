const { transform } = require("babel-core")

function transformCode(code) {
  return transform(code, { plugins: ["../../.."] }).code
}

test("simple function", () => {
  expect(
    transformCode(`
// @test-export
function foo() {}
    `)
  ).toMatchSnapshot()
})

test("simple variable", () => {
  expect(
    transformCode(`
// @test-export
const foo = 42;
    `)
  ).toMatchSnapshot()
})

test("function imbrication", () => {
  expect(
    transformCode(`
// @test-export
function foo(str) {
  console.log(str);
  function foo() {}
  foo();
}

// @test-export
function bar() {
  bar.biz = 1;
}

foo("foo");
    `)
  ).toMatchSnapshot()
})

test("variables usage inside functions", () => {
  expect(
    transformCode(`
// @test-export
let foo, bar;

// @test-export
let a = 42;

foo = 12;

bar = foo;
biz = 12;

function blah() {
  return foo;
}

function blih() {
  var foo;
  return foo;
}
    `)
  ).toMatchSnapshot()
})

test("previous statement trailing comment", () => {
  expect(
    transformCode(`
// foo
const Biz = {
    bar: true,
}

// @test-export
function format(rights) {
    console.log('whatever')
}

module.exports = {}
    `)
  ).toMatchSnapshot()
})

test("readme example", () => {
  expect(
    transformCode(`
// @test-export
function appendFoo(str) {
    return str + "foo"
}

module.exports = function (str) {
    return appendFoo(str).toUpperCase()
}
    `)
  ).toMatchSnapshot()
})
