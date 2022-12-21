/**
 * @fileoverview Disallow `throw`
 * @author Blake Mealey
 */
'use strict';

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/** @type {import('eslint').Rule.RuleModule} */
module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Disallow `throw`',
      recommended: true,
      url: 'https://github.com/blake-mealey/throw-not/blob/main/packages/eslint-plugin-throw-not/docs/rules/no-throw.md',
    },
    schema: [],
    messages: {
      'throw-found': 'throw statement found',
      'replace-with-return': 'Replace with a return statement',
    },
    hasSuggestions: true,
  },

  create(context) {
    // variables should be defined here

    //----------------------------------------------------------------------
    // Helpers
    //----------------------------------------------------------------------

    // any helper functions should go here or else delete this section

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      // visitor functions for different types of nodes
      ThrowStatement: (node) => {
        context.report({
          node,
          messageId: 'throw-found',
          suggest: [
            {
              messageId: 'replace-with-return',
              fix: (fixer) =>
                fixer.replaceTextRange(
                  [node.range[0], node.argument.range[0] - 1],
                  'return',
                ),
            },
          ],
        });
      },
    };
  },
};
