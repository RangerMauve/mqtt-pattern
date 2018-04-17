# mqtt-pattern
Fast library for matching MQTT patterns with named wildcards to extract data from topics

Successor to [mqtt-regex](./mqtt-regex)

## Example:

``` javascript
var MQTTPattern = require("mqtt-pattern");

// Wildcards in patterns don't need names
var pattern = "device/+id/+/#data";

var topic = "device/fitbit/heartrate/rate/bpm";

var params = MQTTPattern.exec(pattern, topic);

// params will be
{
	id: "fitbit",
	data: ["rate", "bmp"]
}

var filled = MQTTPattern.fill(pattern, params);
// filled will be
"device/fitbit/undefined/rate/bmp"

MQTTPattern.clean("hello/+param1/world/#param2");
// hello/+/world/#

```

## Installing

With NPM:

```bash
npm install --save mqtt-pattern
```

## API

### `exec(pattern : String, topic : String) : Object | null`
Validates that `topic` fits the `pattern` and parses out any parameters.
If the topic doesn't match, it returns `null`

### `matches(pattern : String, topic : String) : Boolean`
Validates whether `topic` fits the `pattern`. Ignores parameters.

### `extract(pattern : String, topic : String) : Object`
Traverses the `pattern` and attempts to fetch parameters from the `topic`.
Useful if you know in advance that your `topic` will be valid and want to extract data.
If the `topic` doesn't match, or the `pattern` doesn't contain named wildcards, returns an empty object.
Do not use this for validation.

### `fill(pattern : String, params: Object) : String`
Reverse of `extract`, traverse the `pattern` and fill in params with keys in an object. Missing keys for `+` params are set to `undefined`. Missing keys for `#` params yeid empty strings.

## How params work

MQTT defines two types of "wildcards", one for matching a single section of the path (`+`), and one for zero or more sections of the path (`#`).
Note that the `#` wildcard must only be used if it's at the end of the topic.
This library was inspired by the syntax in the routers for web frameworks.

### Examples of topic patterns:

#### user/+id/#path
This would match paths that start with `user/`, and then extract the next section as the user `id`.
Then it would get the following paths and turn them into an array for the `path` param.
Here is some input/output that you can expect:

	user/bob/status/mood: {id: "bob", path:["status","mood"]
	user/bob: {id:"bob", path: []}
	user/bob/ishungry: {id: "bob", path: ["ishungry"]

#### device/+/+/component/+type/#path
Not all wildcards need to be associated with a parameter, and it could be useful to use plain MQTT topics.
In this example you might only care about the status of some part of a device, and are willing to ignore a part of the path.
Here are some examples of what this might be used with:

	device/deviceversion/deviceidhere/component/infrared/status/active: {type:"infrared",path: ["status","active"]}
