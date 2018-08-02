#!/usr/bin/env node
'use strict';

const program = require('commander');
const fetch = require('node-fetch');
const targz = require('tar.gz');

program
  .version('1.0.0')
  .description('Module Management')
 
// Add Command
program
  .command('add <modules>')
  .alias('a')
  .description('Add a module')
  .action((modules) => {
    var compress = new targz().compress(__dirname, './' + modules + '.tgz',
      function (err) {
        if (err)
          console.log(err);
        const file = '@' + __dirname + '/' + modules + '.tar.gz';
        const { exec } = require('child_process');
        exec(`curl -X POST -H "Content-Type: multipart/form-data"  -v -F 'avatar=${file}'  http://localhost:9004/api/v1/modules`, (err, stdout, stderr) => {
          if (err) {
            console.error("execution failed");
            console.error(err);
            return;
          }
          console.log(`stdout: ${stdout}`);
          console.log(`stderr: ${stderr}`);
        });
      });
  });

program
  .command('list')
  .alias('l')
  .description('List all modules')
  .action(() => fetch('http://localhost:9004/api/v1/modules')
    .then(res => res.json())
    .then(json => console.log(json))
  )
  

program
  .command('remove <originalname>')
  .alias('r')
  .description('Remove a module')
  .action(originalname => {
    fetch('http://localhost:9004/api/v1/modules/' + originalname, {
      method: 'DELETE',
    })
  })

  program
  .command('one <originalname>')
  .alias('o')
  .description('Remove a module')
  .action(originalname => {
    fetch('http://localhost:9004/api/v1/modules/' + originalname)
    .then(res => res.json())
    .then(json => console.log(json))
  })

program.parse(process.argv);
