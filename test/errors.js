require("should");
var sinon = require("sinon");
var fnhook = require("../lib/fn-hooks");

describe("ERRORS", function () {
	var Class, stub;

	beforeEach(function () {
		Class = function () { };
		stub = sinon.stub();
	});

	describe("synchronous", function () {
		it("pre() - when passing an Error to next() - should not call the method", function () {
			fnhook(Class);

			Class.method = function () {
				stub();
			};

			Class.pre("method", function (next) {
				next(new Error());
			});

			Class.method();

			stub.callCount.should.equal(0);
		});

		it("pre() - when passing an Error to next() - should return the error", function () {
			fnhook(Class);

			Class.method = function () { };

			Class.pre("method", function (next) {
				return next(new Error());
			});

			(Class.method() instanceof Error).should.be.ok;
		});

		it("post() - with two hooks and passing an Error to next() - should not call the second hook", function () {
			fnhook(Class);

			Class.method = function () { };

			Class.post("method", function (next) {
				next(new Error());
			});

			Class.post("method", function (next) {
				stub();
				next();
			});

			Class.method();

			stub.callCount.should.equal(0);
		});
	});

	describe("async", function () {
		it("pre() - when passing an Error to next() and method has a callback - should not call the method", function (done) {
			fnhook(Class);

			Class.method = function (callback) {
				stub();
				callback();
			};

			Class.pre("method", function (next) {
				next(new Error());
			});

			Class.method(function () {
				stub.callCount.should.equal(0);
				done();
			});
		});

		it("pre() - when passing an Error to next() and method has a callback - should pass the error to the callback", function (done) {
			fnhook(Class);

			Class.method = function (callback) {
				callback();
			};

			Class.pre("method", function (next) {
				next(new Error());
			});

			Class.method(function (error) {
				(error instanceof Error).should.be.ok;
				done();
			});
		});

		it("post() - with two hooks using a callback and passing an Error to next() - should not call the second hook", function (done) {
			fnhook(Class);

			Class.method = function (callback) {
				callback();
			};

			Class.post("method", function (next) {
				next(new Error());
			});

			Class.post("method", function (next) {
				stub();
				next();
			});

			Class.method(function () {
				stub.callCount.should.equal(0);
				done();
			});
		});

		it("post() - with two hooks using a callback and passing an Error to next() - should pass the error to the callback", function (done) {
			fnhook(Class);

			Class.method = function (callback) {
				callback();
			};

			Class.post("method", function (next) {
				next(new Error());
			});

			Class.post("method", function (next) {
				next();
			});

			Class.method(function (error) {
				(error instanceof Error).should.be.ok;
				done();
			});
		});
	});
});