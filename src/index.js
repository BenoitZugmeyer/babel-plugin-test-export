"use strict"

function hasExposeComment(node) {
  if (!node || !node.leadingComments) return false
  return node.leadingComments.some((comment) => (
    comment.value.includes("@test-export")
  ))
}

function maybeDeclareExport(t, state, path) {
  if (state.get("exportDeclared")) return
  state.set("exportDeclared", true)

  const statement = path.find((p) => p.parentPath.isProgram())

  // statement.insertBefore(
  //   t.exportNamedDeclaration(
  //     t.variableDeclaration("const", [
  //       t.variableDeclarator(
  //         t.identifier("__test__"),
  //         t.objectExpression([])
  //       ),
  //     ]),
  //     []
  //   )
  // )

  statement.insertBefore(
    t.variableDeclaration("const", [
      t.variableDeclarator(
        t.identifier("__test__"),
        t.objectExpression([])
      ),
    ])
  )

  statement.parentPath.pushContainer(
    "body",
    t.assignmentExpression(
      "=",
      t.memberExpression(
        t.memberExpression(
          t.identifier("module"),
          t.identifier("exports")
        ),
        t.identifier("__test__")
      ),
      t.identifier("__test__")
    )
  )
}

const replaceVisitor = {
  ReferencedIdentifier(path, state) {
    maybeReplace(path, state)
  },

  Scope(path, { id }) {
    if (!path.scope.bindingIdentifierEquals(id.name, id)) path.skip()
  },

  AssignmentExpression(path, state) {
    maybeReplace(path.get("left"), state)
  },
}

function replaceNode(t, scope, declaration) {
  const newNode = t.memberExpression(t.identifier("__test__"), declaration.id)

  scope.traverse(scope.block, replaceVisitor, {
    newNode,
    id: declaration.id,
    t,
  })

  return newNode
}

function maybeReplace(path, { t, id, newNode }) {
  if (path.node.name === id.name) {
    if (path.parentPath.isCallExpression()) {
      const call = t.clone(path.parentPath.node)
      call.callee = t.memberExpression(newNode, t.identifier("call"))
      call.arguments.unshift(t.identifier("undefined"))
      path.parentPath.replaceWith(call)
    }
    else {
      path.replaceWith(newNode)
    }
  }
}

module.exports = function ({ types: t }) {
  return {
    visitor: {

      VariableDeclaration(path, state) {
        if (!hasExposeComment(path.node)) return

        maybeDeclareExport(t, state, path)

        path.replaceWithMultiple(
          path.node.declarations.map((declaration) => {

            const newNode = replaceNode(t, path.scope, declaration)

            return t.expressionStatement(
              t.assignmentExpression("=", newNode, declaration.init || t.identifier("undefined"))
            )
          })
        )
      },

      FunctionDeclaration(path, state) {
        if (!hasExposeComment(path.node)) return

        maybeDeclareExport(t, state, path)

        const newNode = replaceNode(t, path.parentPath.scope, path.node)

        const expression = t.clone(path.node)
        expression.type = "FunctionExpression"

        path.replaceWith(
          t.expressionStatement(
            t.assignmentExpression("=", newNode, expression)
          )
        )
      },

    },
  }
}
