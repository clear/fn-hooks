# fn-hooks

A complete re-write of [hooks](https://github.com/bnoguchi/hooks-js) for Node.js to overcome some fundamental flaws with the original library. Intended as a drop-in replacement with extended functionality.

## Why?

The original **hooks** library attaches hooks to objects and it's this object-centric focus that makes it very difficult to use in conjunction with the protoypal inheritance pattern. When attaching hooks to various levels of a complex inheritance tree it quickly became obvious that **hooks** would no longer meet our needs. Introducing **fn-hooks** which attaches hooks to functions, irrespective of the object being called.

More detail to come...

## License

[The MIT License (MIT)](https://github.com/clear/platos-model/blob/master/LICENSE) - Copyright (c) 2013 Clear Learning Systems