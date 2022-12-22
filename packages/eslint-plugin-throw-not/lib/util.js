function isDefined(value) {
  return value !== null && value !== undefined;
}

function isFunctionDeclaration(node) {
  return node.type === 'FunctionDeclaration';
}

/**
 * Is the given node a function expression node?
 *
 * It doesn't matter what type of function expression.
 */
function isFunctionExpressionLike(node) {
  return (
    node.type === 'FunctionExpression' ||
    node.type === 'ArrowFunctionExpression'
  );
}

function isFunctionLike(node) {
  return isFunctionDeclaration(node) || isFunctionExpressionLike(node);
}

/**
 * Return the first ancestor that meets the given check criteria.
 */
function getAncestorOfType(checker, node, child = null) {
  return checker(node, child)
    ? node
    : isDefined(node)
    ? getAncestorOfType(checker, node.parent, node)
    : null;
}

/**
 * Test if the given node is in a function's body.
 *
 * @param node - The node to test.
 */
function inFunctionBody(node) {
  const functionNode = getAncestorOfType(
    (n, c) => isFunctionLike(n) && n.body === c,
    node,
  );

  // TODO: do we need functionNode.async?
  return functionNode !== null;
}

module.exports = { isDefined, getAncestorOfType, inFunctionBody };
