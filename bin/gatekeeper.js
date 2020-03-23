#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const prompts = require('prompts');
const chalk = require('chalk');
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
      console.log(chalk.red('You need to enter a filename'));
      return 1;
    }
    else if(fs.existsSync(argv.file) === false) {
      console.log(chalk.red(`The file, ${argv.file}, does not exist.`));
      return 1;
    }
    else if(path.extname(argv.file) !== '.js') {
      console.log(chalk.red(`${argv.file} is not a javascript file`));
      return 1;
    }
    else {
      getVars(argv.file).then((environmentVars) => {
        let dataArr = [];
        (async () => {
          for(let k = 0; k < environmentVars.length; k++) {
            if(environmentVars[k] === '\n') {
              dataArr.push(environmentVars[k]);
            }
            else {
              const response = await prompts({
                type: 'text',
                name: 'value',
                message: `set: ${chalk.green(environmentVars[k])}`,
                validate: (value) => {
                  dataArr.push(environmentVars[k] + value);
                  return true;
                }
              })
            }

            if(k === environmentVars.length - 1) {
              let contentBuffer = new Uint8Array(Buffer.from(dataArr.join('')));
              fs.writeFile('.env', contentBuffer, (err) => {
                if(err) { reject(err);}
                console.log('.env file saved');
              })
            }
          }
        })();
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
      console.log(chalk.red('You need to enter a directory'));
      return;
    }
    else if(fs.existsSync(argv.directory) === false) {
      console.log(chalk.red('That is not a directory!'));
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

          if(path.extname(duoArr[1]) !== '.js') {
            console.log('not javascript file');
          }
          else {
            getVars(argv.directory + duoArr[1]).then((environmentVars) => {
              console.log('done');
            }).catch((err) => {
              console.log(err);
            })
          }
        })
      })
    }
  })
  .help()
  .argv