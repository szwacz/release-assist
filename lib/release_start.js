const chalk = require('chalk');
const git = require('./git');
const version = require('./version');
const changelog = require('./changelog');
const packageJson = require('./package_json');

const finishCommand = () => {
  // Check if release-assist is integrated into the repository or used via global installation.
  let cmd = 'release-assist --finish';
  packageJson.getScripts().forEach((script) => {
    if (/^release-assist.*-f/.test(script.value)) {
      cmd = `npm run ${script.name}`;
    }
  });
  return cmd;
};

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
    console.log(chalk.green(`Release draft ready! Check out new entry in ${changelog.changelogFilename} and give it a final touch.`));
    console.log(chalk.green(`When you're done, don't commit the changes on your own. Run command "${finishCommand()}" and we'll do it for you.`));
  })
  .catch((err) => {
    console.log(chalk.red(err.message));
  });
};
