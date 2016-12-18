// @test-export
function appendFoo(str) {
    return str + "foo"
}

module.exports = function (str) {
    return appendFoo(str).toUpperCase()
}
