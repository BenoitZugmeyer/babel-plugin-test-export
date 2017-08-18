const path = require("path")
const fs = require("fs")
const { transformFileSync } = require("babel-core")

function trim(str) {
  return str.replace(/^\s+|\s+$/, "")
}

describe("strip `exports test = ...` code from your codebase", () => {
  const fixturesDir = path.join(__dirname, "fixtures")
  fs.readdirSync(fixturesDir).map(caseName => {
    it(`should pass ${caseName.split("-").join(" ")}`, () => {
      const fixtureDir = path.join(fixturesDir, caseName)
      const actual = transformFileSync(path.join(fixtureDir, "input.js"), {
        plugins: ["../../.."],
      }).code

      const expected = fs
        .readFileSync(path.join(fixtureDir, "expected.js"))
        .toString()

      expect(trim(actual)).toBe(trim(expected))
    })
  })
})
