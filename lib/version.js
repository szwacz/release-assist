const inquirer = require("inquirer");
const semver = require("semver");
const git = require("./git");
const log = require("./log");
const packageJson = require("./package_json");

const askForNewVersion = () => {
  return git.getCommitMessagesSinceLastRelease().then(commits => {
    log.normal("");
    log.normal("Commits since last release:");
    log.normal("");
    commits.forEach(commit => {
      log.normal(`- ${commit}`);
    });
    log.normal("");

    const currentVersion = packageJson.getVersion();
    return inquirer
      .prompt([
        {
          type: "list",
          name: "releaseType",
          message:
            "Choose new version for the package, above you see all commit messages since last release to help you decide.",
          choices: [
            {
              name: `${semver.inc(currentVersion, "patch")} (patch)`,
              value: "patch"
            },
            {
              name: `${semver.inc(currentVersion, "minor")} (minor)`,
              value: "minor"
            },
            {
              name: `${semver.inc(currentVersion, "major")} (major)`,
              value: "major"
            }
          ]
        }
      ])
      .then(answer => {
        const newVersion = semver.inc(currentVersion, answer.releaseType);
        packageJson.setVersion(newVersion);
        return newVersion;
      });
  });
};

module.exports = {
  askForNewVersion
};
