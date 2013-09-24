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
				var cb = _.last(arguments);

				//Intercept any potential callback
				if (_.isFunction(cb)) {
					arguments[arguments.length - 1] = function () {
						//Add callback and defer to post()
						var args = _.toArray(arguments);
						args.push(cb);

						next.call(this, "post", 0, args);
					};
				}

				//Call pre hooks
				return next.call(this, "pre", 0, arguments);
			};
		}

		//Add to list of handlers
		fnWrapped[methodName][hook].push(fn);

		//Start call chain
		function next(hook, index, args) {
			//Temporary state
			var hasCallback = _.isFunction(_.last(args));
			
			//Error blocks chain
			if (args[0] instanceof Error) {
				//Return in callback
				if (hasCallback)
					return _.last(args).call(this, args[0]);
				else
					return args[0];
			}

			//Check for last handler
			if (fnWrapped[methodName][hook][index] === undefined) {
				//Call method if pre or end if post
				if (hook === "pre") {
					//Store return value for returning after POST hooks
					var response = fnWrapped[methodName].fn.apply(this, args);

					if (!hasCallback)
						next.call(this, "post", 0, args);

					return response;
				} else if (hook === "post" && hasCallback) {
					//Call asynchronous callback with previous aguments
					_.last(args).apply(this, _.initial(args));
				}
			} else {
				//Insert next() callback into arguments
				args = Array.prototype.splice.call((args || [ ]), 0);
				args.unshift(function () {
					//Merge with default arguments (the ternary operator removes the unneeded next() first argument unless there's
					//an error, in which case that argument is conveniently overwritten with the error)
					args.splice(0, arguments.length + (arguments[0] instanceof Error ? 0 : 1), _.toArray(arguments));

					return next.call(this, hook, index + 1, _.flatten(args));
				}.bind(this));

				//Call hook, passing in a callback that will forward to the next hook
				return fnWrapped[methodName][hook][index].apply(this, args);
			}
		}
	}
};