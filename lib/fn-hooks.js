var _ = require("lodash");

//Pass in the object you wish to add hooks to
module.exports = function (object) {
	var fnWrapped = { };

	//Setup hook binders
	_([ "pre", "post" ]).each(function (hook) {
		//pre() and post() binders
		object[hook] = function (methodName, fn) {
			wrap(object, methodName, fn, hook);
		};

		//removePre() and removePost()
		object["remove" + hook[0].toUpperCase() + hook.slice(1)] = function (methodName, fn) {
			//Sanity check
			if (fnWrapped[methodName]) {
				if (fn) {
					//Remove function
					fnWrapped[methodName][hook] = _.without(fnWrapped[methodName][hook], fn);
				} else {
					//No fn, remove all
					fnWrapped[methodName][hook] = [ ];
				}
			}
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
				next.call(this, "pre", 0, arguments);
			};
		}

		//Add to list of handlers
		fnWrapped[methodName][hook].push(fn);

		//Start call chain
		function next(hook, index, args) {
			//Check for last handler
			if (fnWrapped[methodName][hook][index] === undefined) {
				//Call method if pre or end if post
				if (hook === "pre") {
					fnWrapped[methodName].fn.apply(this, args);
					next.call(this, "post", 0, args);
				}
			} else {
				//Insert next() callback into arguments
				args = Array.prototype.splice.call((args || [ ]), 0);
				args.unshift(function () { next.call(this, hook, index + 1, arguments); }.bind(this));

				//Call hook, passing in a callback that will forward to the next hook
				fnWrapped[methodName][hook][index].apply(this, args);
			}
		}
	}
};