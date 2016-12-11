var git = require('./git');

module.exports = function () {
  git.ensureCurrentBranchIs('master')
  .then(git.ensureNoUncommitedChanges)
  .then(git.ensureRepoInSyncWithOrigin);
};
