'use strict';

// foo

const __test__ = {};
const Biz = {
    bar: true

    // @test-export
};
__test__.format = function format(rights) {
    console.log('whatever');
};

module.exports = {};
module.exports.__test__ = __test__
