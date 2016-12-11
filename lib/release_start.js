const git = require('./git');
const version = require('./version');

module.exports = () => {
  git.ensureCurrentBranchIs('master')
  .then(git.ensureNoUncommitedChanges)
  .then(git.ensureRepoInSyncWithOrigin)
  .then(version.askForNewVersion);
};
