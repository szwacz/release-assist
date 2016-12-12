const chalk = require('chalk');
const git = require('./git');
const version = require('./version');
const changelog = require('./changelog');

module.exports = () => {
  git.ensureCurrentBranchIs('master')
  .then(git.ensureNoUncommitedChanges)
  .then(git.ensureRepoInSyncWithOrigin)
  .then(version.askForNewVersion)
  .then((newVersion) => {
    return git.getCommitMessagesSinceLastRelease()
    .then((commits) => {
      const commitsAsBullets = commits.map(commit => `- ${commit}`).join('\n');
      const now = new Date();
      changelog.insertNewRelease({
        version: newVersion,
        date: now,
        text: commitsAsBullets,
      });
    });
  })
  .then(() => {
    console.log(chalk.green(`Release draft ready! Give final touch to ${changelog.changelogFilename}`));
  })
  .catch((err) => {
    console.log(chalk.red(err.message));
  });
};
