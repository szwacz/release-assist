const jetpack = require('fs-jetpack');
const inquirer = require('inquirer');
const semver = require('semver');
const git = require('./git');

const askForNewVersion = () => {
  return git.getCommitMessagesSinceLastRelease()
  .then((commits) => {
    console.log('');
    console.log('Commits since last release:');
    console.log('');
    commits.forEach((commit) => {
      console.log(`- ${commit}`);
    });
    console.log('');

    const pkg = jetpack.read('package.json', 'json');
    return inquirer.prompt([{
      type: 'list',
      name: 'releaseType',
      message: 'Choose new version for the package, above you see all commit messages since last release to help you decide.',
      choices: [
        {
          name: `${semver.inc(pkg.version, 'patch')} (patch)`,
          value: 'patch',
        },
        {
          name: `${semver.inc(pkg.version, 'minor')} (minor)`,
          value: 'minor',
        },
        {
          name: `${semver.inc(pkg.version, 'major')} (major)`,
          value: 'major',
        },
      ],
    }])
    .then((answer) => {
      pkg.version = semver.inc(pkg.version, answer.releaseType);
      jetpack.write('package.json', pkg);
      return pkg.version;
    });
  });
};

module.exports = {
  askForNewVersion,
};
