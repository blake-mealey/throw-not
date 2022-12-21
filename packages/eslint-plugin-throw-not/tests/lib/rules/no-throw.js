/**
 * @fileoverview Disallow `throw`
 * @author Blake Mealey
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-throw'),
  RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester();
ruleTester.run('no-throw', rule, {
  valid: ['function foo() { return new Error() }'],

  invalid: [
    {
      code: 'function foo() { throw new Error() }',
      errors: [
        {
          messageId: 'throw-found',
          suggestions: [
            {
              messageId: 'replace-with-return',
              output: 'function foo() { return new Error() }',
            },
          ],
        },
      ],
    },
    {
      code: 'throw new Error()',
      errors: [
        {
          messageId: 'throw-found',
          suggestions: [
            { messageId: 'replace-with-return', output: 'return new Error()' },
          ],
        },
      ],
    },
    {
      code: "throw new Error('message')",
      errors: [
        {
          messageId: 'throw-found',
          suggestions: [
            {
              messageId: 'replace-with-return',
              output: "return new Error('message')",
            },
          ],
        },
      ],
    },
    {
      code: "throw 'error'",
      errors: [
        {
          messageId: 'throw-found',
          suggestions: [
            {
              messageId: 'replace-with-return',
              output: "return 'error'",
            },
          ],
        },
      ],
    },
  ],
});
