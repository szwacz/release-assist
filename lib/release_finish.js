const git = require('./git');
const log = require('./log');
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
    log.success(`Release ${versionOfRelease} done!`);
  })
  .catch((err) => {
    log.failure(err.message);
  });
};
