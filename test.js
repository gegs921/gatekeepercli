const test = require('ava');
const getVars = require('./lib/getVars.js');

test('resolves with array of environment vars', t => {
  const file = 'testDir/test1.js';
  return getVars(file).then((environmentVariables) => {
    console.log(environmentVariables);
    t.deepEqual(environmentVariables, ['USER=', '\n', 'PASS=', '\n', 'SECRET=', '\n']);
  })
})