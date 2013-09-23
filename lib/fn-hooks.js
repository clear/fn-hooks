var _ = require("lodash");

//Pass in the object you wish to add hooks to
module.exports = function (object) {
	var fnWrapped = { };

	//Setup hook binders
	_(["pre", "post"]).each(function (hook) {
		object[hook] = function (methodName, fn) {
			wrap(object, methodName, fn, hook);
		};
	});

	function wrap(object, methodName, fn, hook) {
		//New handler for this function
		if (fnWrapped[methodName] === undefined) {
			fnWrapped[methodName] = {
				pre: [ ],
				post: [ ],
				fn: object[methodName]
			};

			object[methodName] = function () {
				//Call pre hooks
				call("pre", 0, arguments);
			};
		}

		//Add to list of handlers
		fnWrapped[methodName][hook].push(fn);

		//Start call chain
		function call(hook, index, args) {
			//Check for last handler
			if (fnWrapped[methodName][hook][index] === undefined) {
				//Call method if pre or end if post
				if (hook === "pre") {
					fnWrapped[methodName].fn.apply(this, args);
					call("post", 0, args);
				}
			} else {
				//Insert next() callback into arguments
				args = Array.prototype.splice.call((args || [ ]), 0);
				args.unshift(function () { call(hook, index + 1, arguments); });

				//Call hook, passing in a callback that will forward to the next hook
				fnWrapped[methodName][hook][index].apply(this, args);
			}
		}
	}
};