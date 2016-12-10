var childProcess = require('child_process');

var getCurrentBranch = function () {
  return childProcess.execSync('git rev-parse --abbrev-ref HEAD')
    .toString().trim();
};

var getRecentCommitMessages = function () {
  return childProcess.execSync('git log --since=12.months --pretty=format:"%s"')
    .toString().split('\n');
};

module.exports = {
  getCurrentBranch: getCurrentBranch,
  getRecentCommitMessages: getRecentCommitMessages
};
