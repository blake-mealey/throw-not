/**
 * @fileoverview Disallow rejecting from Promises
 * @author Blake Mealey
 */
'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const rule = require('../../../lib/rules/no-reject'),
  RuleTester = require('eslint').RuleTester;

//------------------------------------------------------------------------------
// Tests
//------------------------------------------------------------------------------

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2015 } });
ruleTester.run('no-reject', rule, {
  valid: [
    'Promise.resolve()',
    'function foo() { return Promise.resolve(); }',
    'function foo() { var err = Promise.resolve(); return err; }',
    'new Promise((resolve) => { resolve(); })',
    'new Promise(function(resolve) { resolve(); })',
    'new Promise(function named(resolve) { resolve(); })',
    'new Promise(function named() { })',
    'const execute = (resolve) => { resolve(); }; new Promise(execute)',
  ],

  invalid: [
    {
      code: 'Promise.reject()',
      errors: [{ messageId: 'constructRejectPromise', type: 'CallExpression' }],
    },
    {
      code: 'function foo() { return Promise.reject(); }',
      errors: [{ messageId: 'constructRejectPromise', type: 'CallExpression' }],
    },
    {
      code: 'function foo() { var err = Promise.reject(); return err; }',
      errors: [{ messageId: 'constructRejectPromise', type: 'CallExpression' }],
    },
    {
      code: 'new Promise((resolve, reject) => { reject(); })',
      errors: [{ messageId: 'defineRejectFunction', type: 'Identifier' }],
    },
    {
      code: 'new Promise(function(resolve, reject) { reject(); })',
      errors: [{ messageId: 'defineRejectFunction', type: 'Identifier' }],
    },
    {
      code: 'new Promise(function named(resolve, reject) { reject(); })',
      errors: [{ messageId: 'defineRejectFunction', type: 'Identifier' }],
    },
    {
      code: 'new Promise(function(...args) { args[1](); })',
      errors: [{ messageId: 'defineRejectFunction', type: 'RestElement' }],
    },
    {
      code: `const execute = (resolve, reject) => { reject(); }; new Promise(execute)`,
      errors: [{ messageId: 'defineRejectFunction', type: 'Identifier' }],
    },
    {
      code: `const execute = (...args) => { args[1](); }; new Promise(execute)`,
      errors: [{ messageId: 'defineRejectFunction', type: 'RestElement' }],
    },
    {
      code: `function execute(resolve, reject) { reject(); }; new Promise(execute)`,
      errors: [{ messageId: 'defineRejectFunction', type: 'Identifier' }],
    },
    {
      code: `const execute = function(resolve, reject) { reject(); }; new Promise(execute)`,
      errors: [{ messageId: 'defineRejectFunction', type: 'Identifier' }],
    },
    {
      code: `const execute = function named(resolve, reject) { reject(); }; new Promise(execute)`,
      errors: [{ messageId: 'defineRejectFunction', type: 'Identifier' }],
    },
    {
      code: `const execute = function named(resolve, reject) { reject(); }; const indirect = execute; new Promise(indirect)`,
      errors: [{ messageId: 'defineRejectFunction', type: 'Identifier' }],
    },
    {
      code: `const execute = function named(resolve, reject) { reject(); }; const { indirect } = { indirect: execute }; new Promise(indirect)`,
      errors: [{ messageId: 'defineRejectFunction', type: 'Identifier' }],
    },
    // {
    //   code: `const execute = function named(resolve, reject) { reject(); }; const obj = { indirect: execute }; const { indirect } = obj; new Promise(indirect)`,
    //   errors: [{ messageId: 'defineRejectFunction', type: 'Identifier' }],
    // },
  ],
});
