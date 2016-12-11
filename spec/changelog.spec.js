/* eslint-env mocha */

var expect = require('chai').expect;
var changelog = require('../lib/changelog');

describe('git utils', function () {
  it('can start new changelog', function () {
    var txt = changelog.insertRelease(undefined, {
      version: '1.0.0',
      date: new Date(2016, 4, 3),
      text: 'foo'
    });
    expect(txt).to.eql('# 1.0.0 (2016-05-03)\nfoo\n');
  });

  it('can insert releases into changelog', function () {
    var changelogText = changelog.insertRelease(undefined, {
      version: '1.0.0',
      date: new Date(2016, 4, 3),
      text: 'foo'
    });
    changelogText = changelog.insertRelease(changelogText, {
      version: '1.0.1',
      date: new Date(2016, 4, 4),
      text: 'bar'
    });
    expect(changelogText).to.eql('# 1.0.1 (2016-05-04)\nbar\n\n# 1.0.0 (2016-05-03)\nfoo\n');
  });

  it('can extract release data from changelog', function () {
    var txt = '# 1.1.1 (2016-03-04)\n'
            + '-foo\n'
            + '-bar\n'
            + '\n'
            + '# 1.0.1 (2015-02-03)\n'
            + '-123\n'
            + '\n'
            + '# 1.0.0 (2014-01-02)\n'
            + '-qwe\n'
            + '-rty\n';
    expect(changelog.extractRelease(txt, '1.1.1')).to.eql({
      version: '1.1.1',
      date: new Date(2016, 2, 4),
      text: '-foo\n'
          + '-bar\n'
    });
    expect(changelog.extractRelease(txt, '1.0.1')).to.eql({
      version: '1.0.1',
      date: new Date(2015, 1, 3),
      text: '-123\n'
    });
    expect(changelog.extractRelease(txt, '1.0.0')).to.eql({
      version: '1.0.0',
      date: new Date(2014, 0, 2),
      text: '-qwe\n'
          + '-rty\n'
    });
  });

  it("throws if can't find given version in changelog", function () {
    var txt = '# 1.1.1 (2016-03-04)\n'
            + '-foo\n'
            + '-bar\n';
    expect(function () {
      changelog.extractRelease(txt, '1.1.0');
    }).to.throw("Can't find release version 1.1.0 in the changelog");
  });
});
