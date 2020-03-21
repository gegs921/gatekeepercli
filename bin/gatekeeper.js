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
      fs.readFile(argv.file, (err, data) => {
        if(err) throw err;
        console.log(data);
      })
    }
  })
  .help()
  .argv();