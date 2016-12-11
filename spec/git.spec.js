/* eslint-env mocha */

var expect = require('chai').expect;
var git = require('../lib/git');

describe('git utils', function () {
  it('can give recent commit messages', function (done) {
    git.getRecentCommitMessages()
    .then(function (commits) {
      expect(commits).to.be.an('array');
      expect(commits.length).to.be.above(1);
      done();
    })
    .catch(done);
  });
});
