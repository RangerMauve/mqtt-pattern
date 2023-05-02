import { clean, exec, extract, fill, matches, MqttParameters } from "./index";
import { Test } from "ts-toolbelt";
import test from "node:test";
// Type Testing

const { check, checks } = Test;

// Exec
const execv = exec("foo/bar/+baz", "foo/bar/test");
checks([
  check<typeof execv, { baz: string } | null, Test.Pass>(),
  check<typeof execv, MqttParameters<"foo/bar/+baz"> | null, Test.Pass>(),
  check<typeof execv, { baz: string[] } | null, Test.Fail>(),
]);

// Matches
const matchv = matches("foo/bar/+baz", "foo/bar/test");
check<typeof matchv, boolean, Test.Pass>();

// Fill
const fillv = fill("foo/bar/+baz/#test", {
  baz: "test",
  test: ["v1", "v2"],
});
check<typeof fillv, "foo/bar/test/v1/v2", Test.Pass>();

// Extract
const extractv = extract("foo/bar/+baz", "foo/bar/test");
checks([
  check<typeof extractv, { baz: string }, Test.Pass>(),
  check<typeof extractv, { baz: string[] }, Test.Fail>(),
]);

// Clean
const cleanv = clean("foo/bar/+baz");
check<typeof cleanv, "foo/bar/+", Test.Pass>();
