import type { MqttParameters, FillTopic, CleanTopic } from "./parameters";
import type { F } from "ts-toolbelt";

export type { MqttParameters } from './parameters'

/**
 * Extract parameters from a topic based on the pattern provided
 * @param pattern Pattern to match against
 * @param topic Topic to extract parameters from
 */
export declare function exec<Pattern extends string>(
  pattern: Pattern,
  topic: string
): MqttParameters<Pattern> | null;

/**
 * Tests if a topic is valid for a certain pattern.
 * @param pattern Pattern to match against
 * @param topic Topic to test
 */
export declare function matches(pattern: string, topic: string): boolean;

/**
 * Take a pattern and fill the parameters with the appropriate values
 * @param pattern Pattern to fill
 * @param params Parameters to insert into the pattern
 */
export declare function fill<
  Pattern extends string,
  Params extends MqttParameters<Pattern>
>(
  pattern: F.Narrow<Pattern>,
  params: F.Narrow<Params>
): FillTopic<Pattern, Params>;

/**
 * Extract parameter values from a topic using a pattern.
 *
 * This function doesn't check if the pattern matches before attempting
 * extraction, @see exec if you want to extract values, with assurances that the
 * topic actually matches the pattern..
 *
 * @deprecated use exec for safety on topic matching the pattern
 * @param pattern Pattern to extract using
 * @param topic Topic to extract values from
 */
export declare function extract<Pattern extends string>(
  pattern: Pattern,
  topic: string
): MqttParameters<Pattern>;

/**
 * Clean a pattern (remove any property names from wildcard segments)
 *
 * @param pattern Pattern to clean
 * @returns cleaned pattern safe for usage in subscriptions etc.
 */
export declare function clean<Pattern extends string>(
  pattern: Pattern
): CleanTopic<Pattern>;
