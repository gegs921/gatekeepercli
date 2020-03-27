const test = require('ava');
const fs = require('fs');
const getVars = require('../lib/getVars.js');
const gitignoreCommand = require('../lib/gitignore.js');

test('resolves with array of environment vars', t => {
  const writeString = "const user = process.env.USER;\nconst pass = process.env.PASS;\nconst secret = process.env.SECRET;"
  fs.writeFile('test/environmentVars.js', writeString, function(err) {
    if(err) throw err;
  })

  const file = 'test/environmentVars.js';
  return getVars(file).then((environmentVariables) => {
    t.deepEqual(environmentVariables, ['USER=', '\n', 'PASS=', '\n', 'SECRET=', '\n']);
  })
})

test('resolves with the string of a file content buffer', t => {
  const writeString = "";
  fs.writeFile('test/.gitignore', writeString, function(err) {
    if(err) throw err;
  })

  return gitignoreCommand('test').then((bufferString) => {
    // bufferString = buffer.toString();
    t.is(bufferString, '\n.env\n');
  })
})