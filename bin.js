#!/usr/bin/env node

const program = require('commander');
const api = require('./index.js');

program
  .version(require('./package.json').version)
  .option('-s, --start', 'start release process')
  .option('-f, --finish', 'finish release process')
  .parse(process.argv);

if (program.start) {
  api.start();
} else if (program.finish) {
  api.finish();
}
