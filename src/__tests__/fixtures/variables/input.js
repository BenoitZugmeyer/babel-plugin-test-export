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
