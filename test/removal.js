require("should");
var sinon = require("sinon");
var fnhook = require("../lib/fn-hooks");

describe("REMOVAL", function () {
	var Class, stub;

	beforeEach(function () {
		Class = function () { };

		stub = sinon.stub();
	
		Class.method = function () {
			stub();
		};
	});

	it("removePre() - after removing all hooks - should only call function", function () {
		fnhook(Class);

		Class.pre("method", function (next) {
			stub();
			next();
		});

		Class.removePre("method");

		Class.method();
		stub.callCount.should.equal(1);
	});

	it("removePre() - with two hooks after removing single hook - should only call one hook and function", function () {
		fnhook(Class);

		var fn1 = function (next) {
			stub();
			next();
		};

		var fn2 = function (next) {
			stub();
			next();
		};

		Class.pre("method", fn1);
		Class.pre("method", fn2);

		Class.removePre("method", fn1);

		Class.method();
		stub.callCount.should.equal(2);
	});

	it("removePost() - after removing all hooks - should only call function", function () {
		fnhook(Class);

		Class.post("method", function (next) {
			stub();
			next();
		});

		Class.removePost("method");

		Class.method();
		stub.callCount.should.equal(1);
	});

	it("removePost() - with two hooks after removing single hook - should only call one hook and function", function () {
		fnhook(Class);

		var fn1 = function (next) {
			stub();
			next();
		};

		var fn2 = function (next) {
			stub();
			next();
		};

		Class.post("method", fn1);
		Class.post("method", fn2);

		Class.removePost("method", fn1);

		Class.method();
		stub.callCount.should.equal(2);
	});
});