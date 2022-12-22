/** This code is copied from the typings in @erichardson-lee/mqtt-router */

//#region Topic Parameter name & type inference

/** Check if a string is a parameter in a type */
type IsParameter<Parameter> = Parameter extends `+${infer ParamName}`
  ? ParamName
  : never | Parameter extends `#${string}`
  ? Parameter
  : never;

/** Type To split by / and extract parameters */
type FilteredTopicSplit<Topic> = Topic extends `${infer PartA}/${infer PartB}`
  ? IsParameter<PartA> | FilteredTopicSplit<PartB>
  : IsParameter<Topic>;

/** Type to get Parameter Value */
type ParameterValue<Parameter> = Parameter extends `#${string}`
  ? string[]
  : string;

/** Type to remove # prefix from parameter */
type StripParameterHash<Parameter> = Parameter extends `#${infer Name}`
  ? Name
  : Parameter;

/** Parameter Type */
export type MqttParameters<Topic> = {
  [key in FilteredTopicSplit<Topic> as StripParameterHash<key>]: ParameterValue<key>;
};
//#endregion

//#region Topic Cleaning

/** Clean a segment of a Topic */
type CleanTopicSegment<Segment> = Segment extends `+${string}`
  ? "+"
  : Segment extends `#${string}`
  ? "#"
  : Segment;

/** Clean a Topic (replace #value or +value with # or + respectively) */
export type CleanTopic<Topic> = Topic extends `${infer PartA}/${infer PartB}`
  ? `${CleanTopicSegment<PartA>}/${CleanTopic<PartB>}`
  : CleanTopicSegment<Topic>;

//#endregion

//#region Topic Filling
type JoinPath<Parts> = Parts extends [infer v, ...infer rest]
  ? rest extends []
    ? v
    : `${v}/${JoinPath<rest>}`
  : "";

type FillParam<
  Section extends string,
  Parameters extends MqttParameters<Section>
> = Section extends `+${infer PName}`
  ? Parameters[PName]
  : Section extends `#${infer PName}`
  ? JoinPath<Parameters[PName]>
  : Section;

export type FillTopic<
  Pattern extends string,
  Parameters extends MqttParameters<Pattern>
> = Pattern extends `${infer Left}/${infer Right}`
  ? `${FillParam<Left, Parameters>}/${FillTopic<Right, Parameters>}`
  : FillParam<Pattern, Parameters>;

//#endregion
