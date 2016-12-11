/* eslint-env mocha */

const expect = require('chai').expect;
const git = require('../lib/git');

describe('git utils', () => {
  it('can give recent commit messages', (done) => {
    git.getRecentCommitMessages()
    .then((commits) => {
      expect(commits).to.be.an('array');
      expect(commits.length).to.be.above(1);
      done();
    })
    .catch(done);
  });
});
