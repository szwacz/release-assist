const chalk = require('chalk');

const taskStart = (str) => {
  process.stdout.write(`${str} `);
  return () => {
    console.log(chalk.green('(done)'));
  };
};

module.exports = {
  taskStart,
};
