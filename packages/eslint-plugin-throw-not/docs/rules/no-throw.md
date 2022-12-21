# Disallow `throw` (`throw-not/no-throw`)

💡 This rule is manually fixable by [editor suggestions](https://eslint.org/docs/developer-guide/working-with-rules#providing-suggestions).

<!-- end auto-generated rule header -->

## Rule Details

This rule helps to enforce the pattern of returning errors instead of throwing them by disallowing throwing
errors.

Examples of **incorrect** code for this rule:

```js
throw new Error();
```

```js
throw new Error('my error');
```

```js
throw 'my error string';
```

Examples of **correct** code for this rule:

```js
return new Error();
```

```js
return new Error('my error');
```

```js
return 'my error string';
```

## When Not To Use It

When you are not following the pattern of returning errors instead of throwing them.

## Further Reading

- https://github.com/blake-mealey/throw-not
