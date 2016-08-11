/**
 * Created by daniel.cluff on 5/30/16.
 */
var crowdControlCalc = (function() {
  "use strict";
  
  var calculator = {};

  calculator.calculateCrowdControlChange = function( input ) {
    var timeline = createEmptyTimeline(getLargestPointInTime(input));

    input.forEach(function(cc) {
      fillTimeline(cc, timeline);
    });

    return timeline
      .reduce(timelineReducer, getTimelineInitialState())
      .effects
      .sort(sortAsc);
  };


  /**
   * Given an array of crowd control "tuples", we want to find
   * the largest possible point in time that a crowd control
   * effect can exist
   *
   * @params {array[array]} ccArray
   *    An array of crowd control "tuples" implemented as an
   *    array. Each "tuple" has three values [b,d,s] according
   *    to the following rules:
   *      b - the beginning time of a crowd control effect (0 <= b <= 1,000,000)
   *      d - the duration of the crowd control effect (0 < d <= 1,000,000)
   *      s - the severity of that crowd control (0 < s <= 100,000)
   *
   * @returns {number}
   *
   * @example
   *
   * var index = getLargestPointInTime([[1,2,2],[3,4,4]]);
   *
   * expect(index).to.be.equal(7);
   */
  function getLargestPointInTime(ccArray) {
    var initialValue = 0;
    var reducer = function(largestTime, cc) {
      var time = cc[0];
      var duration = cc[1];
      var timeSample = time + duration;

      if( largestTime < timeSample )
        return timeSample;

      return largestTime;
    };

    return ccArray.reduce(reducer, initialValue);
  }

  /**
   * We want to create an empty timeline of fixed length
   *
   * @params {number} length
   *    represents the length of the timeline you want to create

   * @returns {array}
   * @example
   *
   * var array = createEmptyTimeline(3);
   *
   * expect(array).to.deep.equal([0,0,0]);
   */
  function createEmptyTimeline(length) {
    var array = Array(length);
    for(var i=0; i<=length; i++)
      array[i] = 0;

    return array;
  }


  /**
   * We want to update the values of a timeline in memory in place
   *
   * @param {array} ccTuple
   *    We implement a "tuple" as an array using the format [b,d,s]
   *    with the following rules:
   *    b  the beginning time of a crowd control effect (0 <= b <= 1,000,000)
   *    d  the duration of the crowd control effect (0 < d <= 1,000,000)
   *    s  the severity of that crowd control (0 < s <= 100,000)
   * @param {array} severityTimeline
   *    Encodes all the severities in effect as an array where the
   *    array index represents time and the value at the index represents
   *    the severity at that time.
   *
   * @example
   *
   * var ccTuple = [1,2,3];
   * var severityTimeline = [0,0,0,0,0,0];
   *
   * fillTimeline(ccTuple, severityTimeline);
   *
   * expect(severityTimeline).to.deep.equal([0,3,3,0,0,0]);
   *
   * @example
   *
   * var ccTuple = [2,3,5];
   * var severityTimeline = [0,3,3,0,0,0];
   *
   * fillTimeline(ccTuple, severityTimeline);
   *
   * expect(severityTimeline).to.deep.equal([0,3,5,5,5,0]);
   */
  function fillTimeline(cc, timeline) {
    var startTime = cc[0];
    var duration = cc[1];
    var severity = cc[2];
    var endTime = startTime + duration;

    for(var i = startTime; i < endTime; i++) {
      if(timeline[i] < severity)
        timeline[i] = severity;
    }
  }

  /**
   * We want a custom sorter for a two dimensional array such
   * that the first element of the array determines the
   * ascending sort order
   *
   * @params {array} lValue
   * @params {array} rValue
   * @example
   *
   * var lValue = [1,0];
   * var rValue = [0,1];
   *
   * var cmp = sortAsc(lValue, rValue);
   *
   * expect(cmp).to.equal(-1);
   */
  function sortAsc(lValue, rValue) {
    if( lValue[0] < rValue[0] )
      return -1;

    if( lValue[0] > rValue[0] )
      return 1;

    return 0;
  }

  /**
   * We want to use a reducer as a state machine. We encapsulate
   * all the algorithms that power the business rules for the
   * crowd control challenge inside.
   *
   * @param {object} state
   * @param {number} severity
   * @example
   *
   * var state = {
   *   effects: [],
   *   register: null,
   *   index: 0
   * };
   *
   * var result = timelineReducer(state, 0);
   *
   * expect(result).to.deep.equal({
   *   effects: [],
   *   register: 0,
   *   index: 1
   * });
   */
  function timelineReducer(state, severity) {
    if(stateIsUninitialized(state,severity))
      return stateInitialized(state, severity);

    if(canAddEffect(state,severity))
      return severityAdded(state,severity);

    return severitySkipped(state, severity);
  };

  /**
   * We need to have a start state for our state machine.

   * @return {object}
   *
   * @example
   *
   *  var result = getTimelineInitialState();
   *
   *  expect(result).to.deep.equal({
   *    effects: [],
   *    register: null,
   *    index: 0
   *  });
   */
  function getTimelineInitialState() {
    return {
      effects: [],
      register: null,
      index: 0
    };
  }

  /**
   * We need to have a means of detecting when the state machines is
   * in the initial state.
   *
   * @param {object} state
   * @param {object} value
   * @example
   *
   * var state = {
   *   effects: [],
   *   register: 0,
   *   index: 0
   * };
   * value = 1;
   *
   * var result = stateIsUninitialized(state, value);
   *
   * expect(result).to.be.true;
   */
  function stateIsUninitialized(state, value) {
    return state.index === 0;
  };

  /**
   * We need a means of detecting when to add an effect as
   * part of the state machine logic.
   *
   * @param {object} state
   * @param {object} value
   * @example
   *
   * var state = {
   *   effects: [],
   *   register: 0,
   *   index: 1
   * };
   * var value = 2;
   *
   * var result = canAddEffect(state,value);
   *
   * expect(result).to.be.true;
   */
  function canAddEffect(state, value) {
    return state.register !== value;
  };

  /**
   * We need to implement the behavior associated with the first state
   * of our state machine.
   *
   * @param {object} state
   * @param {number} value
   * @example
   *
   * var state = {
   *    effects: [],
   *   register: 0,
   *   index: 0
   * };
   * var value = 10;
   *
   * var result = stateInitialized(state,value);
   *
   * expect(result).to.deep.equal({
   *   effects: [],
   *   register: 10,
   *   index: 1
   * });
   */
  function stateInitialized(state, value) {
    if( value === 0 )
      return Object.assign({}, state, {
        register: value,
        index: state.index + 1
      });

    return Object.assign({}, state, {
      effects: [[0,value]],
      register: value,
      index: state.index + 1
    });
  };

  /**
   * We need to record the effect to our state machine when we
   * add a severity to to the timeline
   *
   * @param {object} state
   * @param {number} value
   * @example
   *
   * var state = {
   *	  effects: [[2,3]],
   *   register: 1,
   *   index: 6
   * };
   * var value = 2;
   *
   * var result = severityAdded(state,value);
   *
   * expect(result).to.deep.equal({
   *   effects: [[2,3],[6,1]],
   *   register: 2,
   *   index: 7
   * });
   */
  function severityAdded(state, value) {
    return Object.assign({}, state, {
      effects: state.effects.concat([[state.index, value]]),
      register: value,
      index: state.index + 1
    });
  };

  /**
   * We need a means of moving to the next state when the state machine
   * has nothing to do.
   *
   * @param {object} state
   * @param {number} value
   * @example
   *
   * var state = {
   *   effects: [[2,3]],
   *   register: 1,
   *   index: 6
   * };
   * var value = 1;
   *
   * var result = severitySkipped(state,value);
   *
   * expect(result).to.deep.equal({
   *   effects: [[2,3]],
   *   register: 1,
   *   index: 7
   * });
   */
  function severitySkipped(state, value) {
    return Object.assign({}, state, {
      register: value,
      index: state.index + 1
    });
  };

  return calculator;
}());
