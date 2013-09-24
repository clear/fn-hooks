require("should");
var fnhook = require("../lib/fn-hooks");

describe("SETUP", function () {
	it("fnhook() - with object passed in - should add pre() and post() methods", function () {
		var Class = function () { };

		fnhook(Class);

		Class.should.have.property("pre");
		Class.should.have.property("post");
	});

	it("fnhook() - with object passed in - should add removePre() and removePost() methods", function () {
		var Class = function () { };

		fnhook(Class);

		Class.should.have.property("removePre");
		Class.should.have.property("removePost");
	});
});