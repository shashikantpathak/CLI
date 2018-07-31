#!/usr/bin/env node
const program = require('commander');
const fetch = require('node-fetch');
var targz = require('tar.gz');

program
  .version('1.0.0')
  .description('Client Management System')


// Add Command
program
  .command('add <modules>')
  .alias('a')
  .description('Add a module')
  .action((modules) => {
    var compress = new targz().compress(__dirname, './' + modules + '.tar.gz',
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

program.parse(process.argv);
