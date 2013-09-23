require("should");
//var sinon = require("sinon");
var fnhook = require("../lib/fn-hooks");

describe("SETUP", function () {
	it("fnhook() - with object passed in - should add pre() and post() methods", function () {
		var Class = function () { };

		fnhook(Class);

		Class.should.have.property("pre");
		Class.should.have.property("post");
	});

	it.skip("testing", function () {
		var Class = function () { };
		Class.test = function () { };
		Class.test2 = function () { };

		var Class2 = function () { };
		Class2.test = function () { };

		fnhook(Class);
		fnhook(Class2);

		Class.pre("test", function () { });
		Class2.pre("test", function () { });
		Class.pre("test2", function () { });
	});
});