const chalk = require('chalk');

const taskStart = (str) => {
  process.stdout.write(`${str} `);
  return {
    done() {
      console.log(chalk.green('(done)'));
    },
    fail() {
      console.log(chalk.red('(failed)'));
    },
  };
};

module.exports = {
  taskStart,
};
