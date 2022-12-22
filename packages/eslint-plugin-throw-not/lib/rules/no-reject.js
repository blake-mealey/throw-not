/**
 * @fileoverview Disallow rejecting Promises
 * @author Blake Mealey
 */
'use strict';

const functionTypes = [
  'FunctionExpression',
  'ArrowFunctionExpression',
  'FunctionDeclaration',
];

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow rejecting Promises',
      recommended: true,
      url: 'https://github.com/blake-mealey/throw-not/blob/main/packages/eslint-plugin-throw-not/docs/rules/no-reject.md',
    },
    schema: [],
    messages: {
      constructRejectPromise: 'Do not construct a Promise that rejects',
      defineRejectFunction: 'Do not define reject function',
    },
  },

  create(context) {
    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    function checkForDefineRejectFunction(node) {
      if (node) {
        if (functionTypes.includes(node.type)) {
          if (node.params.length > 0 && node.params[0].type === 'RestElement') {
            context.report({
              node: node.params[0],
              messageId: 'defineRejectFunction',
            });
          }

          if (node.params.length > 1) {
            context.report({
              node: node.params[1],
              messageId: 'defineRejectFunction',
            });
          }
        } else if (node.type === 'Identifier') {
          const definitionVariable = context
            .getScope()
            .variables.find((v) => v.name === node.name);
          if (definitionVariable) {
            const definition = definitionVariable.defs[0];
            if (definition.type === 'FunctionName') {
              checkForDefineRejectFunction(definition.node);
            } else if (definition.type === 'Variable') {
              if (definition.node.init.type === 'ObjectExpression') {
                const property = definition.node.init.properties.find(
                  (p) => p.key.name === node.name,
                );
                if (property) {
                  checkForDefineRejectFunction(property.value);
                }
              } else {
                checkForDefineRejectFunction(definition.node.init);
              }
            }
          }
        }
      }
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      NewExpression: (node) => {
        // Promise constructor
        if (
          node.callee.type === 'Identifier' &&
          node.callee.name === 'Promise'
        ) {
          checkForDefineRejectFunction(node.arguments[0]);
        }
      },
      CallExpression: (node) => {
        if (
          node.callee.type === 'MemberExpression' &&
          node.callee.object.type === 'Identifier' &&
          node.callee.object.name === 'Promise' &&
          node.callee.property.type === 'Identifier' &&
          node.callee.property.name === 'reject'
        ) {
          context.report({
            node,
            messageId: 'constructRejectPromise',
          });
        }
      },
    };
  },
};
