require("should");
var sinon = require("sinon");
var fnhook = require("../lib/fn-hooks");

describe("PRE", function () {
	describe("static", function () {
		var Class;
		var stub;

		beforeEach(function () {
			Class = function () { };

			stub = sinon.stub();
			
			Class.method = function () {
				stub();
			};
		});

		it("pre() - with no hooks - should call function", function () {
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
});