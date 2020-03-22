#!/usr/bin/env node
const fs = require('fs');
const getVars = require('../lib/getVars.js');

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
    else if(fs.existsSync(argv.file) === false) {
      console.log(`The file, ${argv.file}, does not exist.`);
      return 1;
    }
    else {
      getVars(argv.file).then((msg) => {
        console.log(msg);
      }).catch((err) => {
        console.log(err);
      })
    }
  })
  .command('createDir [directory]', 'execute main function for all js files in a directory', (yargs) => {
    yargs.positional('directory', {
      type: 'string',
      describe: 'directory to iterate through'
    })
  }, function(argv) {

    if(!argv.directory) {
      console.log('You need to enter a directory');
      return;
    }
    else if(fs.existsSync(argv.directory) === false) {
      console.log('That is not a directory!');
    }
    else {
      fs.readdir(argv.directory, function(err, files) {
        console.log(files);
        for(i = 0; i < files.length; i++) {
          getVars(`./${argv.directory}/${files[i]}`).then((msg) => {
            console.log(msg);
          }).catch((err) => {
            console.log(err);
          })
        }
      })
    }
  })
  .help()
  .argv