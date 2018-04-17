"use strict";

var test = require("tape");

var MQTTPattern = require("./");

test("matches() supports patterns with no wildcards", function (t) {
	t.plan(1);
	t.ok(MQTTPattern.matches("foo/bar/baz", "foo/bar/baz"), "Matched topic");
});

test("matches() doesn't match different topics", function (t) {
	t.plan(1);
	t.notOk(MQTTPattern.matches("foo/bar/baz", "baz/bar/foo"), "Didn't match topic");
});

test("matches() supports patterns with # at the beginning", function (t) {
	t.plan(1);
	t.ok(MQTTPattern.matches("#", "foo/bar/baz"), "Matched topic");
});

test("matches() supports patterns with # at the end", function (t) {
	t.plan(1);
	t.ok(MQTTPattern.matches("foo/#", "foo/bar/baz"), "Matched topic");
});

test("matches() supports patterns with # at the end and topic has no children", function (t) {
	t.plan(1);
	t.ok(MQTTPattern.matches("foo/bar/#", "foo/bar"), "Matched childless topic");
});

test("matches() doesn't support # wildcards with more after them", function (t) {
	t.plan(1);
	t.notOk(MQTTPattern.matches("#/bar/baz", "foo/bar/baz"), "Didn't match topic");
});

test("matches() supports patterns with + at the beginning", function (t) {
	t.plan(1);
	t.ok(MQTTPattern.matches("+/bar/baz", "foo/bar/baz"), "Matched topic");
});

test("matches() supports patterns with + at the end", function (t) {
	t.plan(1);
	t.ok(MQTTPattern.matches("foo/bar/+", "foo/bar/baz"), "Matched topic");
});

test("matches() supports patterns with + in the middle", function (t) {
	t.plan(1);
	t.ok(MQTTPattern.matches("foo/+/baz", "foo/bar/baz"), "Matched topic");
});

test("matches() supports patterns multiple wildcards", function (t) {
	t.plan(1);
	t.ok(MQTTPattern.matches("foo/+/#", "foo/bar/baz"), "Matched topic");
});

test("matches() supports named wildcards", function (t) {
	t.plan(1);
	t.ok(MQTTPattern.matches("foo/+something/#else", "foo/bar/baz"), "Matched topic");
});

test("matches() supports leading slashes", function (t){
	t.plan(2);
	t.ok(MQTTPattern.matches("/foo/bar", "/foo/bar"), "Matched topic");
	t.notok(MQTTPattern.matches("/foo/bar", "/bar/foo"), "Didn't match invalid topic");
});

test("extract() returns empty object of there's nothing to extract", function (t) {
	t.plan(1);
	t.deepEqual(MQTTPattern.extract("foo/bar/baz", "foo/bar/baz"), {}, "Extracted empty object");
});

test("extract() returns empty object if wildcards don't have label", function (t) {
	t.plan(1);
	t.deepEqual(MQTTPattern.extract("foo/+/#", "foo/bar/baz"), {}, "Extracted empty object");
});

test("extract() returns object with an array for # wildcard", function (t) {
	t.plan(1);
	t.deepEqual(MQTTPattern.extract("foo/#something", "foo/bar/baz"), {
		something: ["bar", "baz"]
	}, "Extracted param");
});

test("extract() returns object with a string for + wildcard", function (t) {
	t.plan(1);
	t.deepEqual(MQTTPattern.extract("foo/+hello/+world", "foo/bar/baz"), {
		hello: "bar",
		world: "baz"
	}, "Extracted params");
});

test("extract() parses params from all wildcards", function (t) {
	t.plan(1);
	t.deepEqual(MQTTPattern.extract("+hello/+world/#wow", "foo/bar/baz/fizz"), {
		hello: "foo",
		world: "bar",
		wow: ["baz", "fizz"]
	}, "Extracted params");
});

test("exec() returns null if it doesn't match", function (t) {
	t.plan(1);
	t.equal(MQTTPattern.exec("hello/world", "foo/bar/baz"), null, "Got null");
});

test("exec() returns params if they can be parsed", function(t){
	t.plan(1);
	t.deepEqual(MQTTPattern.exec("foo/+hello/#world", "foo/bar/baz"), {
		hello: "bar",
		world: ["baz"]
	}, "Extracted params");
});

test("fill() fills in pattern with both types of wildcards", function(t){
	t.plan(1);
	t.deepEqual(MQTTPattern.fill("foo/+hello/#world", {
		hello: "Hello",
		world: ["the", "world", "wow"],
	}), "foo/Hello/the/world/wow", "Filled in params");
});

test("fill() fills missing + params with undefined", function(t){
	t.plan(1);
	t.deepEqual(
		MQTTPattern.fill("foo/+hello", {}),
		"foo/undefined",
		"Filled in params"
	);
});

test("fill() ignores empty # params", function(t){
	t.plan(1);
	t.deepEqual(
		MQTTPattern.fill("foo/#hello", {}),
		"foo",
		"Filled in params"
	);
});

test("fill() ignores non-named # params", function (t) {
	t.plan(1);
	t.deepEqual(
		MQTTPattern.fill("foo/#", {}),
		"foo",
		"Filled in params"
	);
});

test("fill() uses `undefined` for non-named + params", function(t){
	t.plan(1);
	t.deepEqual(
		MQTTPattern.fill("foo/+", {}),
		"foo/undefined",
		"Filled in params"
	);
});

test("clean() removes parameter names", function(t){
	t.plan(1);
	t.equal(MQTTPattern.clean("hello/+param1/world/#param2"), "hello/+/world/#", "Got hello/+/world/#");
});

test("clean() works when there aren't any parameter names", function(t){
	t.plan(1);
	t.equal(MQTTPattern.clean("hello/+/world/#"), "hello/+/world/#", "Got hello/+/world/#");
});
