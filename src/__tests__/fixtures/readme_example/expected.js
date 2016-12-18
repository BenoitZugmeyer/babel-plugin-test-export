const __test__ = {};

// @test-export
__test__.appendFoo = function appendFoo(str) {
    return str + "foo";
};

module.exports = function (str) {
    return __test__.appendFoo.call(undefined, str).toUpperCase();
};
module.exports.__test__ = __test__
