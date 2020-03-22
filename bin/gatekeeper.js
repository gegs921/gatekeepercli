#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
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
      function filewalker(dir, done) {
        let results = [];
    
        fs.readdir(dir, function(err, list) {
          if (err) return done(err);
  
          var pending = list.length;
  
          if (!pending) return done(null, results);
  
          list.forEach(function(file){
            file = path.resolve(dir, file);

            fs.stat(file, function(err, stat){
              // If directory, execute a recursive call
              if (stat && stat.isDirectory()) {
                // Add directory to array [comment if you need to remove the directories from the array]

                filewalker(file, function(err, res){
                  results = results.concat(res);
                  if (!--pending) done(null, results);
                });
              } else {
                results.push(file);

                if (!--pending) done(null, results);
              }
            });
          });
        });
      }
      filewalker(argv.directory, (err, data) => {
        if(err) {
          throw err;
        }

        console.log(data);

        data.forEach((file) => {
          let duoArr = file.split(argv.directory);
          console.log(argv.directory + duoArr[1]);
          getVars(argv.directory + duoArr[1]).then((msg) => {
            console.log(msg);
          }).catch((err) => {
            console.log(err);
          })
        })
      })
    }
  })
  .help()
  .argv