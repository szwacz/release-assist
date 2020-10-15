const git = require("./git");
const log = require("./log");
const packageJson = require("./package_json");
const changelog = require("./changelog");

module.exports = () => {
  const versionOfRelease = packageJson.getVersion();

  git
    .ensureCurrentBranchIs("master")
    .then(git.ensureThereIsSomethingToCommit)
    .then(() => {
      return git.commitRelease(versionOfRelease);
    })
    .then(() => {
      log.success(`Release ${versionOfRelease} commited!`);
    })
    .catch(err => {
      log.failure(err.message);
    });
};
