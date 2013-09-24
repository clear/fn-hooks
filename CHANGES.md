# fn-hooks Change Log

## Unreleased
- Decent documentation

## 0.1.0
The majority of functionality has been implemented:
- pre() and post() hooks for surrounding a function.
- removePre() and removePost() for removing existing hooks.
- Support for asynchronous functions where the callback will be called after all hooks have completed (pre and post).
- Support for complex prototypal inheritance by binding hooks to functions (within both Object or Object.prototype).
- Pass an Error to next() from within any hook to halt the hook chain.
- trigger() for manually firing a function's hooks without invoking that function directly.