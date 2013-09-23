require("should");
var sinon = require("sinon");
var fnhook = require("../lib/fn-hooks");

describe("POST", function () {
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

			it("post() - with single hook - should be able to access object properites from hook", function () {
				Class.property = true;

				fnhook(Class);

				Class.post("method", function (next) {
					this.should.have.property("property");
					next();
				});

				Class.method();
			});

			it("post() - with single hook - should call pre() before function", function () {
				fnhook(Class);

				Class.post("method", function (next) {
					stub.callCount.should.equal(1);
					stub();
					next();
				});

				Class.method();
				stub.callCount.should.equal(2);
			});

			it("post() - with two hooks - should call both hooks before function", function () {
				fnhook(Class);

				Class.post("method", function (next) {
					stub.callCount.should.equal(1);
					stub();
					next();
				});

				Class.post("method", function (next) {
					stub.callCount.should.equal(2);
					stub();
					next();
				});

				Class.method();
				stub.callCount.should.equal(3);
			});
		});

		describe("with parameters", function () {
			var argument = "test";

			it("post() - with one parameter - should pass parameter to post()", function () {
				Class.method = function (arg) {
					arg.should.equal(argument);
				};

				fnhook(Class);

				Class.post("method", function (next, arg) {
					arg.should.equal(argument);
					next(arg);
				});

				Class.method(argument);
			});

			it("post() - where method mutates parameter - should pass original parameter to post() hook", function () {
				Class.method = function (arg) {
					arg.should.equal(argument);
					arg = "changed";
				};

				fnhook(Class);

				Class.post("method", function (next, arg) {
					arg.should.equal(argument);
					next(argument);
				});

				Class.method(argument);
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
					stub.callCount.should.equal(0);
					stub();
				};

				instance = new Class();
			});

			it("post() - with single hook - should be able to access object properites from hook", function () {
				Class.prototype.property = true;

				fnhook(Class.prototype);

				Class.prototype.post("method", function (next) {
					this.should.have.property("property");
					this.should.have.property("secondProperty");
					next();
				});

				instance.secondProperty = true;
				instance.method();
			});

			it("post() - with single hook - should call post() before function", function () {
				fnhook(Class.prototype);

				Class.prototype.post("method", function (next) {
					stub.callCount.should.equal(1);
					stub();
					next();
				});

				instance.method();
				stub.callCount.should.equal(2);
			});

			it("post() - with two hooks - should call both hooks before function", function () {
				fnhook(Class.prototype);

				Class.prototype.post("method", function (next) {
					stub.callCount.should.equal(1);
					stub();
					next();
				});

				Class.prototype.post("method", function (next) {
					stub.callCount.should.equal(2);
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

			it("post() - with one parameter - should pass parameter to post()", function () {
				fnhook(Class.prototype);

				Class.prototype.post("method", function (next, arg) {
					arg.should.equal(argument);
					next(arg);
				});

				instance.method(argument);
			});

			it("post() - where method mutates parameter - should pass original parameter to post() hook", function () {
				Class.prototype.method = function (arg) {
					arg.should.equal(argument);
					arg = "changed";
				};

				fnhook(Class.prototype);

				Class.prototype.post("method", function (next, arg) {
					arg.should.equal(argument);
					next(argument);
				});

				instance.method(argument);
			});
		});
	});
});