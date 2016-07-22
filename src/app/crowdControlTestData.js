/**
 * Created by daniel.cluff on 5/30/16.
 */
"use strict";
var crowdControlTestData = (function() {
  var lastRandomInt = 0;

  var sampleInput = {
    sampleInput0: [[2, 4, 5], [8, 1, 1], [3, 4, 2], [4, 1, 6]],
    sampleInput1: [[1, 2, 3], [2, 3, 3], [1, 5, 3], [6, 2, 3], [6, 1, 3]],
    sampleInput2: [[1, 2, 5], [2, 3, 3], [4, 2, 4]],
    sampleInput3: [[1, 2, 4], [5, 3, 6]],
    sampleInput4: [[0, 2, 3], [2, 3, 4], [5, 2, 2]]
  };

  var sampleOutput = {
    sampleOutput0: [[2, 5], [4, 6], [5, 5], [6, 2], [7, 0], [8, 1], [9, 0]],
    sampleOutput1: [[1, 3], [8, 0]],
    sampleOutput2: [[1, 5], [3, 3], [4, 4], [6, 0]],
    sampleOutput3: [[1, 4], [3, 0], [5, 6], [8, 0]],
    sampleOutput4: [[0, 3], [2, 4], [5, 2], [7, 0]]
  };

  var testData = {};

  function generateRandomInt() {
    lastRandomInt = Math.floor( Math.random() * 5 );
  }

  testData.randomTestInput = function() {
    generateRandomInt();
    return sampleInput[ "sampleInput" + lastRandomInt.toString() ];
  };

  testData.getSolutionForLastTestInput = function() {
    return sampleOutput[ "sampleOutput" + lastRandomInt.toString() ];
  };

  return testData;
}());