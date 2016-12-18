const __test__ = {};

// @test-export
__test__.foo = function foo(str) {
  console.log(str);
  function foo() {}
  foo();
}

// @test-export
;

__test__.bar = function bar() {
  __test__.bar.biz = 1;
};

__test__.foo.call(undefined, "foo");
module.exports.__test__ = __test__
