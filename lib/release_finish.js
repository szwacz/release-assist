const chalk = require('chalk');
const git = require('./git');
const packageJson = require('./package_json');
const changelog = require('./changelog');

module.exports = () => {
  const versionOfRelease = packageJson.getVersion();

  git.ensureCurrentBranchIs('master')
  .then(git.ensureThereIsSomethingToCommit)
  .then(() => {
    return git.commitRelease(versionOfRelease);
  })
  .then(() => {
    const releaseChanges = changelog.extractRelease(versionOfRelease);
    return git.tagRelease(versionOfRelease, releaseChanges.text);
  })
  .then(() => {
    console.log(chalk.green(`Release ${versionOfRelease} done!`));
  })
  .catch((err) => {
    console.log(chalk.red(err.message));
  });
};
