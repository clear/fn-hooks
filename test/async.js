require("should");
var sinon = require("sinon");
var fnhook = require("../lib/fn-hooks");

describe("ASYNC", function () {
	var Class;

	beforeEach(function () {
		Class = function () { };
	});

	describe("no returned arguments", function () {
		var stub;

		beforeEach(function () {
			stub = sinon.stub();

			Class.method = function (callback) {
				stub();
				callback();
			};
		});

		it("pre() - with callback - should call callback after method", function (done) {
			fnhook(Class);

			Class.pre("method", function (next, callback) {
				stub.callCount.should.equal(0);
				stub();
				next(callback);
			});

			Class.method(function () {
				stub.callCount.should.equal(2);
				done();
			});
		});

		it("post() - with callback - should call callback after post hooks", function (done) {
			fnhook(Class);

			Class.post("method", function (next, callback) {
				stub.callCount.should.equal(1);
				stub();
				next(callback);
			});

			Class.method(function () {
				stub.callCount.should.equal(2);
				done();
			});
		});
	});

	describe("returned arguments", function () {
		beforeEach(function () {
			Class.method = function (callback) {
				callback("result");
			};
		});

		it("pre() - with callback returning an argument - should call callback with returned argument", function (done) {
			fnhook(Class);

			Class.pre("method", function (next, callback) {
				next(callback);
			});

			Class.method(function (response) {
				response.should.equal("result");
				done();
			});
		});

		it("post() - with callback returning an argument - should call callback with returned argument", function (done) {
			fnhook(Class);

			Class.post("method", function (next, response, callback) {
				next(response, callback);
			});

			Class.method(function (response) {
				response.should.equal("result");
				done();
			});
		});
	});
});