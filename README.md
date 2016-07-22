# Task Description
## Problem Statement
In League of Legends, the game uses an algorithm to determine what dominant crowd control effect is applied to a champion at a particular point in time. This question asks you to write this algorithm. We want your algorithm to determine the moments in time when the severity of crowd control effects change.

## Definitions
**Crowd Control** is defined as any effect on a champion that impairs that champion. Crowd controls can have a low severity to a high severity. An example of a lower severity crowd control is a silence, where you can’t cast spells. A higher severity crowd control could be a stun, where you lose all interaction with a champion. Additionally, a crowd control effect has a duration.
A crowd control effect is said to dominate another if it has a higher severity and it is applied over the entire time a less severe effect is applied. The dominated crowd control effect can be ignored and has no effect. For example, if a champion is stunned and silenced at the same time the silence doesn’t matter because a stun has a higher severity.

## Input
Input for this algorithm will be an Array2D.
The first dimensional length of the Array2D will be `n` (1 < n < 500).  
Each first dimensional element in the array will contain three values `[b,d,s]`:  
* b - the beginning time of a crowd control effect (0 <= b <= 1,000,000)  
* d - the duration of the crowd control effect (0 < d <= 1,000,000)  
* s - the severity of that crowd control (0 < s <= 100,000)  

The input is unsorted.

Example input:

```javascript
[[2, 4, 5], [8, 1, 1], [3, 4, 2], [4, 1, 6]]
```

## Output
The output should be an Array2D where:
* The first dimensional length of the Array2D should be the number of valid crowd control effect changes.
* Each first dimensional element should contain an Array containing pairs `[t, s]`.
* The first value of the output, `t`, will represent the time at which a change in severity happened and the second value, `s`, represents the new severity that is applied.
* The Array2D should be sorted by `t` in ascending order.

Assume that the starting severity is 0 at time 0, but the point `[0, 0]` should not be included in your output. When no crowd control effects are being applied you should include the change to 0 severity in your output.

Example output (corresponds to example input above):
```javascript
[[2, 5], [4, 6], [5, 5], [6, 2], [7, 0], [8, 1], [9, 0]]
```

## Implementation details
Write your solution for this algorithm within the `calculateCrowdControlChange` function within the [crowdControlCalc.js](src/app/crowdControlCalc.js) file.
Ensure that the return value from this function is rendered visually within the [index.html](src/index.html) file. Bonus points for rendering the result with visual treatment.

The file [crowdControlTestData.js](src/app/crowdControlTestData.js) contains some sample inputs, and their respective correctly formatted outputs.
1. call: `randomTestInput` to have a random test input rendered from the supplied list.
2. then call: `getSolutionForLastTestInput` to receive the respective expected output.

League players may realize this algorithm is an oversimplification as multiple crowd control effects can affect a champion with unique impairments
