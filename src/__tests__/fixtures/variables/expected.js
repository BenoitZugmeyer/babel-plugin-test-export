const __test__ = {};
// @test-export
__test__.foo = undefined;
__test__.bar = undefined;

// @test-export

__test__.a = 42;


__test__.foo = 12;

__test__.bar = __test__.foo;
biz = 12;

function blah() {
  return __test__.foo;
}

function blih() {
  var foo;
  return foo;
}
module.exports.__test__ = __test__
