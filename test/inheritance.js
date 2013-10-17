require("should");
var sinon = require("sinon");
var util = require("util");
var fnhook = require("../lib/fn-hooks");

describe("INHERITANCE", function () {
	var Parent, Child1, Child2;
	var stubParent, stubChild1, stubChild2;

	beforeEach(function () {
		stubParent = sinon.stub();
		stubChild1 = sinon.stub();
		stubChild2 = sinon.stub();

		Parent = function () { };
		Child1 = function () { };
		Child2 = function () { };
	});

	it("pre() - when child that inherits method - should call the parent and child pre hook", function () {
		Parent.prototype.method = function () {
			stubParent();
		};

		util.inherits(Child1, Parent);
		util.inherits(Child2, Parent);

		fnhook(Parent.prototype);
		fnhook(Child1.prototype);

		Parent.prototype.pre("method", function (next) {
			stubParent();
			next();
		});

		Child1.prototype.pre("method", function (next) {
			stubChild1();
			next();
		});

		var instance = new Child1();
		instance.method();

		stubParent.callCount.should.equal(2);
		stubChild1.callCount.should.equal(1);
	});

	it("pre() - when two sibling children but calling method on only one - should call only that child's pre hook", function () {
		Parent.prototype.method = function () {
			stubParent();
		};

		util.inherits(Child1, Parent);
		util.inherits(Child2, Parent);

		fnhook(Parent.prototype);
		fnhook(Child1.prototype);
		fnhook(Child2.prototype);

		Child1.prototype.method = function () {
			stubChild1();
		};
		
		Child2.prototype.method = function () {
			stubChild2();
		};

		Parent.prototype.pre("method", function (next) {
			stubParent();
			next();
		});

		Child1.prototype.pre("method", function (next) {
			stubChild1();
			next();
		});

		Child2.prototype.pre("method", function (next) {
			stubChild2();
			next();
		});

		var instance = new Child1();
		instance.method();

		stubParent.callCount.should.equal(0);
		stubChild1.callCount.should.equal(2);
		stubChild2.callCount.should.equal(0);
	});

	it("pre() - when two sibling children, calling method on one that calls parent - should call the child and parent's pre hooks", function () {
		Parent.prototype.method = function () {
			stubParent();
		};

		util.inherits(Child1, Parent);
		util.inherits(Child2, Parent);

		fnhook(Parent.prototype);
		fnhook(Child1.prototype);
		fnhook(Child2.prototype);

		Child1.prototype.method = function () {
			//jshint -W106
			this.constructor.super_.prototype.method.call(this);
			//jshint +W106

			stubChild1();
		};
		
		Child2.prototype.method = function () {
			stubChild2();
		};

		Parent.prototype.pre("method", function (next) {
			stubParent();
			next();
		});

		Child1.prototype.pre("method", function (next) {
			stubChild1();
			next();
		});

		Child2.prototype.pre("method", function (next) {
			stubChild2();
			next();
		});

		var instance = new Child1();
		instance.method();

		stubParent.callCount.should.equal(2);
		stubChild1.callCount.should.equal(2);
		stubChild2.callCount.should.equal(0);
	});

	it("pre() - with two levels of inheritance - should call parent and both children hooks", function () {
		var stubChild2 = sinon.stub();

		Parent.prototype.method = function () {
			stubParent();
		};

		util.inherits(Child1, Parent);
		util.inherits(Child2, Child1);

		fnhook(Parent.prototype);
		fnhook(Child1.prototype);
		fnhook(Child2.prototype);

		Parent.prototype.pre("method", function (next) {
			stubParent();
			next();
		});

		Child1.prototype.pre("method", function (next) {
			stubChild1();
			next();
		});

		Child2.prototype.pre("method", function (next) {
			stubChild2();
			next();
		});

		var instance = new Child2();
		instance.method();

		stubParent.callCount.should.equal(2);
		stubChild1.callCount.should.equal(1);
		stubChild2.callCount.should.equal(1);
	});
});