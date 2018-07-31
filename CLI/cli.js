#!/usr/bin/env node
const program = require('commander');
const fetch=require('node-fetch');



// const {
//  app
// } = require('./index.js');

program 
  .version('1.0.0')
  .description('Client Management System')


// Add Command
program
  .command('add <modules>')
  .alias('a')
  .description('Add a module')
  .action((modules) => {
    console.log(modules);
    const file='@/home/csuraz/Documents/'+modules;
    const { exec } = require('child_process');
    exec(`curl -X POST -H "Content-Type: multipart/form-data"  -v -F 'avatar=${file}'  http://localhost:9004/api/v1/module`, (err, stdout, stderr) => {
  if (err) {
    console.error("execution failed");
    console.error(err);
    return;
  }

  // the *entire* stdout and stderr (buffered)
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr}`);
});
  });


  program
  .command('list')
  .alias('l')
  .description('List all modules')
  .action(() =>fetch('http://localhost:9004/api/v1/modules')
  .then(res => res.json())
  .then(json => console.log(json))
  )


  program
  .command('remove <_id>')
  .alias('r')
  .description('Remove a module')
  .action(_id =>{fetch('http://localhost:9004/api/v1/modules/'+ _id,{
    method: 'DELETE',
})})

program.parse(process.argv);
