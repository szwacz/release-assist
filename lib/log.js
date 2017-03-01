/* eslint no-console:off */

const chalk = require('chalk');

const log = (str) => {
  console.log(str);
};

const logSuccess = (str) => {
  log(chalk.green(str));
};

const logFailure = (str) => {
  log(chalk.red(str));
};

const taskStart = (str) => {
  process.stdout.write(`${str} `);
  return {
    done() {
      logSuccess('(done)');
    },
    fail() {
      logFailure('(failed)');
    },
  };
};

module.exports = {
  normal: log,
  success: logSuccess,
  failure: logFailure,
  taskStart,
};
