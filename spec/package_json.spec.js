/* eslint-env mocha */

const expect = require('chai').expect;
const jetpack = require('fs-jetpack');
const packageJson = require('../lib/package_json');

describe('package.json utils', () => {
  it('can give version', () => {
    const version = jetpack.read('package.json', 'json').version;
    expect(packageJson.getVersion()).to.eql(version);
  });

  it('can list scripts', () => {
    const scripts = jetpack.read('package.json', 'json').scripts;
    const parsedScripts = Object.keys(scripts).map((key) => {
      return {
        name: key,
        value: scripts[key],
      };
    });
    expect(packageJson.getScripts()).to.eql(parsedScripts);
  });
});
