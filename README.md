# fn-hooks

A complete re-write of [hooks](https://github.com/bnoguchi/hooks-js) for Node.js to overcome some fundamental flaws with the original library. Intended as a drop-in replacement with extended functionality.

[![Build Status](https://travis-ci.org/clear/fn-hooks.png)](https://travis-ci.org/clear/fn-hooks)
[![NPM version](https://badge.fury.io/js/fn-hooks.png)](http://badge.fury.io/js/fn-hooks)

## Why?

The original **hooks** library attaches hooks to objects and it's this object-centric focus that makes it very difficult to use in conjunction with the protoypal inheritance pattern. When attaching hooks to various levels of a complex inheritance tree it quickly became obvious that **hooks** would no longer meet our needs. Introducing **fn-hooks** which attaches hooks to functions, irrespective of the object being called.

More detail to come...

## Tests

It's a small library so there aren't many.

	$ npm test

## Contributing

All contributions are welcome! I'm happy to accept pull requests as long as they conform to the following guidelines:

- Keep the API clean, we prefer ease-of-use over extra features
- Don't break the build and add tests where necessary
- Keep the coding style consistent, we follow [JSHint's Coding Style](http://www.jshint.com/hack/)

Otherwise, please [open an issue](https://github.com/clear/fn-hooks/issues/new) if you have any suggestions or find a bug.

## License

[The MIT License (MIT)](https://github.com/clear/fn-hooks/blob/master/LICENSE) - Copyright (c) 2013 Clear Learning Systems