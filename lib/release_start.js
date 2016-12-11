const git = require('./git');

module.exports = () => {
  git.ensureCurrentBranchIs('master')
  .then(git.ensureNoUncommitedChanges)
  .then(git.ensureRepoInSyncWithOrigin);
};
