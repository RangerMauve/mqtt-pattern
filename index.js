"use strict";
var SEPARATOR = "/";
var SINGLE = "+";
var ALL = "#";

module.exports = {
	matches: matches,
	extract: extract,
	exec: exec,
};

function exec(pattern, topic) {
	return matches(pattern, topic) ? extract(pattern, topic) : null;
}

function matches(pattern, topic) {
	var patternSegments = pattern.split(SEPARATOR);
	var topicSegments = topic.split(SEPARATOR);

	var patternLength = patternSegments.length;
	var topicLength = topicSegments.length;
	var lastIndex = patternLength - 1;

	for(var i = 0; i < patternLength; i++){
		var currentPattern = patternSegments[i];
		var patternChar = currentPattern[0];
		var currentTopic = topicSegments[i];

		if(!currentTopic) return false;

		// Only allow # at end
		if(patternChar === ALL)
			return i === lastIndex;
		if(patternChar !== SINGLE && currentPattern !== currentTopic)
			return false;
	}

	return patternLength === topicLength;
}


function extract(pattern, topic) {
	var params = {};
	var patternSegments = pattern.split(SEPARATOR);
	var topicSegments = topic.split(SEPARATOR);

	var patternLength = patternSegments.length;

	for(var i = 0; i < patternLength; i++){
		var currentPattern = patternSegments[i];
		var patternChar = currentPattern[0];

		if(currentPattern.length === 1)
			continue;

		if(patternChar === ALL){
			params[currentPattern.slice(1)] = topicSegments.slice(i);
			break;
		} else if(patternChar === SINGLE){
			params[currentPattern.slice(1)] = topicSegments[i];
		}
	}

	return params;
}
