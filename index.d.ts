import { PatternTemplateType } from "./parameters";
import { FillTopic } from "./parameters";
import { CleanPath } from "./parameters";
import type { MqttParameters } from "./parameters.d.ts";
import type { F } from "ts-toolbelt";

/**
 * Extract parameters from a topic based on the pattern provided
 * @param pattern Pattern to match against
 * @param topic Topic to extract parameters from
 */
declare function exec<Pattern extends string>(
  pattern: Pattern,
  topic: string
): MqttParameters<Pattern> | null;

/**
 * Tests if a topic is valid for a certain pattern.
 * @param pattern Pattern to match against
 * @param topic Topic to test
 */
declare function matches(pattern: string, topic: string): boolean;

/**
 * Take a pattern and fill the parameters with the appropriate values
 * @param pattern Pattern to fill
 * @param params Parameters to insert into the pattern
 */
declare function fill<
  Pattern extends string,
  Params extends MqttParameters<Pattern>
>(
  pattern: F.Narrow<Pattern>,
  params: F.Narrow<Params>
): FillTopic<Pattern, Params>;

const a = fill("foo/+bar/baz/#test", {
  bar: "test1",
  test: ["test1", "test2", "test3"],
});
type A = typeof a;
/**
 * Extract parameter values from a topic using a pattern.
 *
 * This function doesn't check if the pattern matches before attempting
 * extraction, @see exec if you want to extract values, with assurances that the
 * topic actually matches the pattern..
 *
 * @param pattern Pattern to extract using
 * @param topic Topic to extract values from
 */
declare function extract<Pattern extends string>(
  pattern: Pattern,
  topic: string
): MqttParameters<Pattern>;

/**
 * Clean a pattern (remove any property names from wildcard segments)
 *
 * @param pattern Pattern to clean
 * @returns cleaned pattern safe for usage in subscriptions etc.
 */
declare function clean<Pattern extends string>(
  pattern: Pattern
): CleanPath<Pattern>;

export { exec };

const a = clean("foo/+bar/baz/#test");
