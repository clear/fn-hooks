require("should");
var sinon = require("sinon");
var fnhook = require("../lib/fn-hooks");

describe("PRE", function () {
	describe("static", function () {
		var Class;

		beforeEach(function () {
			Class = function () { };
		});

		describe("no parameters", function () {
			var stub;

			beforeEach(function () {
				stub = sinon.stub();
			
				Class.method = function () {
					stub();
				};
			});

			it("pre() - with no hooks - should only call function", function () {
				fnhook(Class);
				Class.method();
				stub.callCount.should.equal(1);
			});

			it("pre() - with single hook - should call pre() before function", function () {
				fnhook(Class);

				Class.pre("method", function (next) {
					stub.callCount.should.equal(0);
					stub();
					next();
				});

				Class.method();
				stub.callCount.should.equal(2);
			});

			it("pre() - with two hooks - should call both hooks before function", function () {
				fnhook(Class);

				Class.pre("method", function (next) {
					stub.callCount.should.equal(0);
					stub();
					next();
				});

				Class.pre("method", function (next) {
					stub.callCount.should.equal(1);
					stub();
					next();
				});

				Class.method();
				stub.callCount.should.equal(3);
			});
		});

		describe("with parameters", function () {
			var argument = "test";

			beforeEach(function () {
				Class.method = function (arg) {
					arg.should.equal(argument);
				};
			});

			it("pre() - with one parameter - should pass parameter to pre()", function () {
				fnhook(Class);

				Class.pre("method", function (next, arg) {
					arg.should.equal(argument);
					next(arg);
				});

				Class.method(argument);
			});

			it("pre() - where hook mutates parameter - should pass changed parameter to method", function () {
				fnhook(Class);

				Class.pre("method", function (next, arg) {
					arg.should.equal("unchanged");
					next(argument);
				});

				Class.method("unchanged");
			});
		});
	});

	describe("prototypal", function () {
		var Class;

		beforeEach(function () {
			Class = function () { };
		});

		describe("no parameters", function () {
			var stub;
			var instance;

			beforeEach(function () {
				stub = sinon.stub();

				Class.prototype.method = function () {
					stub();
				};

				instance = new Class();
			});

			it("pre() - with no hooks - should only call function", function () {
				fnhook(Class.prototype);
				instance.method();
				stub.callCount.should.equal(1);
			});

			it("pre() - with single hook - should call pre() before function", function () {
				fnhook(Class.prototype);

				Class.prototype.pre("method", function (next) {
					stub.callCount.should.equal(0);
					stub();
					next();
				});

				instance.method();
				stub.callCount.should.equal(2);
			});

			it("pre() - with two hooks - should call both hooks before function", function () {
				fnhook(Class.prototype);

				Class.prototype.pre("method", function (next) {
					stub.callCount.should.equal(0);
					stub();
					next();
				});

				Class.prototype.pre("method", function (next) {
					stub.callCount.should.equal(1);
					stub();
					next();
				});

				instance.method();
				stub.callCount.should.equal(3);
			});
		});

		describe("with parameters", function () {
			var argument = "test";
			var instance;

			beforeEach(function () {
				Class.prototype.method = function (arg) {
					arg.should.equal(argument);
				};

				instance = new Class();
			});

			it("pre() - with one parameter - should pass parameter to pre()", function () {
				fnhook(Class.prototype);

				Class.prototype.pre("method", function (next, arg) {
					arg.should.equal(argument);
					next(arg);
				});

				instance.method(argument);
			});

			it("pre() - where hook mutates parameter - should pass changed parameter to method", function () {
				fnhook(Class.prototype);

				Class.prototype.pre("method", function (next, arg) {
					arg.should.equal("unchanged");
					next(argument);
				});

				instance.method("unchanged");
			});
		});
	});
});