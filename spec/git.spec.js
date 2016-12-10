/* eslint-env mocha */

var expect = require('chai').expect;
var git = require('../lib/git');

describe('git utils', function () {
  it('can give name of current branch', function () {
    expect(git.getCurrentBranch()).to.be.a('string');
  });

  it('can give recent commit messages', function () {
    var commits = git.getRecentCommitMessages();
    expect(commits).to.be.an('array');
    expect(commits.length).to.be.above(1);
  });
});
