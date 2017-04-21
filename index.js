"use strict";
var SEPARATOR = "/";
var SINGLE = "+";
var ALL = "#";

module.exports = {
	match: match,
	extract: extract,
	exec: exec,
};

function exec(pattern, topic) {
	return match(pattern, topic) ? extract(pattern, topic) : null;
}

function match(pattern, topic) {
	var patternLength = pattern.length;
	var almostPatternLength = patternLength - 1;
	var topicLength = topic.length;
	var patternIndex = 0;
	var topicIndex = 0;

	// Topics shouldn't contain wildcards!
	if((topic.indexOf(SINGLE) !== -1) || (topic.indexOf(ALL) !== -1))
		return false;

	while(patternIndex < patternLength){
		// Get the next pattern character to test against
		var patternChar = pattern[patternIndex];
		var atEnd = patternIndex === almostPatternLength;

		if(patternChar === ALL){
			// # wildcard must be at the end
			if(patternLength === 1) return true;
			return (toNext(pattern, patternIndex) === almostPatternLength);
		} else if(patternChar === SINGLE) {
			// If already at the end, finish up inhere
			// Go to the next segment
			patternIndex = toNext(pattern, patternIndex);
			topicIndex = toNext(topic, topicIndex);
			// If we're at the end, exit the loop
			if(atEnd){
				patternIndex++;
				topicIndex++;
			}
		} else {
			var topicChar = topic[topicIndex];
			if(topicChar !== patternChar)
				return false;
			patternIndex++;
			topicIndex++;
		}
	}

	return (topicIndex === topicLength);
}


function extract(pattern, topic) {
	var patternLength = pattern.length;
	var almostPatternLength = patternLength - 1;
	var patternIndex = 0;
	var topicIndex = 0;
	var params = {};

	var paramName;
	var paramValue;

	while(patternIndex < patternLength){
		var patternChar = pattern[patternIndex];
		var nextChar = pattern[patternIndex + 1];

		var nextPattern = toNext(pattern, patternIndex);
		var nextTopic = toNext(topic,topicIndex);

		var atEnd = nextPattern === almostPatternLength;

		if(patternChar === ALL && nextChar) {
			paramName = pattern.slice(patternIndex + 1);
			paramValue = topic.slice(topicIndex).split("/");
			params[paramName] = paramValue;
		} else if(patternChar === SINGLE && nextChar !== "/") {
			if(atEnd){
				paramName = pattern.slice(patternIndex + 1);
				paramValue = topic.slice(topicIndex);
			} else {
				paramName = pattern.slice(patternIndex + 1, nextPattern - 1);
				paramValue = topic.slice(topicIndex, nextTopic - 1);
			}
			params[paramName] = paramValue;
		}

		patternIndex = nextPattern;
		topicIndex = nextTopic;

		if(atEnd) {
			patternIndex++;
			topicIndex++;
		}
	}

	return params;
}

function toNext(topic, index) {
	var nextIndex = topic.indexOf(SEPARATOR, index);
	if(nextIndex === -1) return topic.length - 1;
	else return nextIndex + 1;
}
