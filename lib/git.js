const childProcess = require('child_process');
const log = require('./log');

const execute = (cmd) => {
  return new Promise((resolve, reject) => {
    childProcess.exec(cmd, (error, stdout) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout.toString().trim());
      }
    });
  });
};

const getCurrentBranch = () => {
  return execute('git rev-parse --abbrev-ref HEAD');
};

const ensureCurrentBranchIs = (name) => {
  return getCurrentBranch().then((currentBranch) => {
    if (currentBranch !== name) {
      throw new Error(`You're not on the "${name}" branch`);
    }
  });
};

const ensureNoUncommitedChanges = () => {
  return execute('git status').then((stdout) => {
    if (!stdout.includes('nothing to commit')) {
      throw new Error('You have uncommited changes, commit them before we can proceed');
    }
  });
};

const ensureThereIsSomethingToCommit = () => {
  return execute('git status').then((stdout) => {
    if (stdout.includes('nothing to commit')) {
      throw new Error('There are no file changes to be commited as a release');
    }
  });
};

const ensureRepoInSyncWithOrigin = () => {
  const task = log.taskStart('Ensuring your local repo is in sync with origin');
  return execute('git fetch').then(() => {
    return execute('git status');
  }).then((stdout) => {
    if (!stdout.includes('Your branch is up-to-date')) {
      task.fail();
      throw new Error('Your local branch is not in sync with origin. Do "git pull" and/or "git push" first.');
    }
    task.done();
  });
};

const getRecentCommitMessages = () => {
  return execute('git log --since=12.months --pretty=format:"%s"').then((stdout) => {
    return stdout.split('\n');
  });
};

const isReleaseCommit = (commitMessage) => {
  return /^\d+\.\d+\.\d+$/.test(commitMessage);
};

const getCommitMessagesSinceLastRelease = () => {
  return getRecentCommitMessages().then((commits) => {
    const indexOfLastReleaseCommit = commits.findIndex(isReleaseCommit);
    return commits.slice(0, indexOfLastReleaseCommit);
  });
};

const commitRelease = (version) => {
  const task = log.taskStart('Commiting and pushing release to origin');
  return execute('git add .')
  .then(() => {
    return execute(`git commit -m "${version}"`);
  })
  .then(() => {
    return execute('git push origin master');
  })
  .then(task.done);
};

const tagRelease = (version, changes) => {
  const task = log.taskStart('Tagging the release');
  return execute(`git tag -a ${version} -m "${changes}"`)
  .then(() => {
    return execute(`git push origin ${version}`);
  })
  .then(task.done);
};

module.exports = {
  ensureCurrentBranchIs,
  ensureNoUncommitedChanges,
  ensureThereIsSomethingToCommit,
  ensureRepoInSyncWithOrigin,
  getRecentCommitMessages,
  getCommitMessagesSinceLastRelease,
  commitRelease,
  tagRelease,
};
