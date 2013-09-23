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
				call(0);
			};
		}

		//Add to list of handlers
		fnWrapped[methodName][hook].push(fn);

		//Start call chain
		function call(index) {
			//Check for last handler
			if (fnWrapped[methodName].pre[index] === undefined) {
				//Call method
				fnWrapped[methodName].fn();
			} else {
				//Call hook, passing in a callback that will forward to the next hook
				fnWrapped[methodName].pre[index](function () { call(index + 1); });
			}
		}
	}
};