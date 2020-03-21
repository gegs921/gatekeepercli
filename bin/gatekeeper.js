#!/usr/bin/env node
const fs = require('fs');

require('yargs')
  .scriptName("gk")
  .usage('$0 <cmd> [args]')
  .command('create [file]', 'main function', (yargs) => {
    yargs.positional('file', {
      type: 'string',
      describe: 'file to iterate through'
    })
  }, function(argv) {
    if(!argv.file) {
      console.log('You need to enter a filename');
      return 1;
    }
    else if(!fs.existsSync(argv.file)) {
      console.log(`The file, ${argv.file}, does not exist.`);
      return 1;
    }
    else {
      let envVariables = [];

      fs.readFile(argv.file, (err, data) => {
        if(err) throw err;
        let words = data.toString().split('\n').join(' ').split(' ');
        for(let i = 0; i < words.length; i++) {
          if(words[i].includes('process.env')) {
            let thirds = words[i].split('.');
            let envVar = thirds[thirds.length - 1];
            if(envVar.includes(';') || envVar.includes(',') || envVar.includes('{')) {
              let envVarChars = envVar.split('');
              envVarChars.pop();
              envVariables.push(envVarChars.join(''));
            }
            else {
              envVariables.push(envVar);
            }
          }
          if(i === words.length - 1) {
            let newArr = [];
            for(let a = 0; a < envVariables.length; a++) {
              newArr.push(envVariables[a] + "=");
              newArr.push("\n");
              if(a === envVariables.length - 1) {
                let contentBuffer = new Uint8Array(Buffer.from(newArr.join('')));
                fs.writeFile('.env', contentBuffer, (err) => {
                  if(err) throw err;
                  console.log('Your .env file has been saved');
                })
              }
            }
          }
        }
      })
    }
  })
  .help()
  .argv