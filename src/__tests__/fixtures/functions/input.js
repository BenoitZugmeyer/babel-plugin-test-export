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
