var childProcess = require('child_process');

var execute = function (cmd) {
  return new Promise(function (resolve, reject) {
    childProcess.exec(cmd, function (error, stdout, stderr) {
      if (error) {
        reject(error);
      } else {
        resolve(stdout.toString().trim());
      }
    });
  });
};

var getCurrentBranch = function () {
  return execute('git rev-parse --abbrev-ref HEAD');
};

var ensureCurrentBranchIs = function (name) {
  return getCurrentBranch().then(function (currentBranch) {
    if (currentBranch !== name) {
      throw new Error("You're not on the " + name + ' branch');
    }
  });
};

var ensureNoUncommitedChanges = function () {
  return execute('git status').then(function (stdout) {
    if (!stdout.includes('nothing to commit')) {
      throw new Error('You have uncommited changes, commit them before we can proceed');
    }
  });
};

var getRecentCommitMessages = function () {
  return execute('git log --since=12.months --pretty=format:"%s"').then(function (stdout) {
    return stdout.split('\n');
  });
};

var ensureRepoInSyncWithOrigin = function () {
  return execute('git fetch').then(function () {
    return execute('git status');
  }).then(function (stdout) {
    if (!stdout.includes('Your branch is up-to-date')) {
      throw new Error('Your local branch is not in sync with origin. Do "git pull" and/or "git push" first.');
    }
  });
};

module.exports = {
  ensureCurrentBranchIs: ensureCurrentBranchIs,
  ensureNoUncommitedChanges: ensureNoUncommitedChanges,
  ensureRepoInSyncWithOrigin: ensureRepoInSyncWithOrigin,
  getRecentCommitMessages: getRecentCommitMessages
};
