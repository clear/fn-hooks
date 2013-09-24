require("should");
var sinon = require("sinon");
var fnhook = require("../lib/fn-hooks");

describe("TRIGGER", function () {
	var Class;

	beforeEach(function () {
		Class = function () { };
	});

	describe("synchronous", function () {
		var methodStub, stub;

		beforeEach(function () {
			methodStub = sinon.stub();
			stub = sinon.stub();
		
			Class.method = function () {
				methodStub();
			};
		});

		it("trigger() - with no hooks - should not call the function", function () {
			fnhook(Class);

			Class.trigger("method");

			methodStub.callCount.should.equal(0);
		});

		it("trigger() - with one pre hook - should only call the hook", function () {
			fnhook(Class);

			Class.pre("method", function (next) {
				stub();
				next();
			});

			Class.trigger("method");

			methodStub.callCount.should.equal(0);
			stub.callCount.should.equal(1);
		});

		it("trigger() - with one pre hook - should restore the method after completing", function () {
			fnhook(Class);

			Class.pre("method", function (next) {
				stub();
				next();
			});

			Class.trigger("method");
			Class.method();

			methodStub.callCount.should.equal(1);
			stub.callCount.should.equal(2);
		});

		it("trigger() - with one post hook - should only call the hook", function () {
			fnhook(Class);

			Class.post("method", function (next) {
				stub();
				next();
			});

			Class.trigger("method");

			methodStub.callCount.should.equal(0);
			stub.callCount.should.equal(1);
		});
	});

	describe("async", function () {
		var methodStub, stub;

		beforeEach(function () {
			methodStub = sinon.stub();
			stub = sinon.stub();
		
			Class.method = function (callback) {
				stub();
				callback();
			};
		});

		it("trigger() - with no hooks - should not call the function", function (done) {
			fnhook(Class);

			Class.trigger("method");

			methodStub.callCount.should.equal(0);
			done();
		});

		it("trigger() - with one pre hook - should only call the hook", function (done) {
			fnhook(Class);

			Class.pre("method", function (next) {
				stub();
				next();
			});

			Class.trigger("method", function () {
				methodStub.callCount.should.equal(0);
				stub.callCount.should.equal(1);
				done();
			});
		});

		it("trigger() - with one post hook - should only call the hook", function (done) {
			fnhook(Class);

			Class.post("method", function (next) {
				stub();
				next();
			});

			Class.trigger("method", function () {
				methodStub.callCount.should.equal(0);
				stub.callCount.should.equal(1);
				done();
			});
		});
	});
});