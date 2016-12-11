var formatDate = function (date) {
  var year = date.getFullYear().toString();
  var month = (date.getMonth() + 1).toString();
  var day = date.getDate().toString();
  if (month.length === 1) {
    month = '0' + month;
  }
  if (day.length === 1) {
    day = '0' + day;
  }
  return year + '-' + month + '-' + day;
};

var insertRelease = function (changelog, newEntry) {
  var heading = '# ' + newEntry.version + ' (' + formatDate(newEntry.date) + ')';
  var newEntryStr = heading + '\n' + newEntry.text + '\n';

  if (typeof changelog !== 'string') {
    return newEntryStr;
  }

  return newEntryStr + '\n' + changelog;
};

var parseChangelog = function (changelog) {
  var lines = changelog.split('\n');
  var entries = [];

  var isHeading = function (line) {
    return /^#/.test(line);
  };

  var parseHeading = function (headingText) {
    var version = /\d+\.\d+\.\d+/.exec(headingText)[0];
    var dateStr = /\d+-\d+-\d+/.exec(headingText)[0];
    var dateParts = dateStr.split('-').map(function (date) { return parseInt(date, 10); });
    var date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
    return {
      version: version,
      date: date
    };
  };

  var collectText = function (position, text) {
    var line = lines[position];
    if (text === undefined) {
      text = '';
    }

    if (isHeading(line) || (line === '' && isHeading(lines[0]))) {
      return text;
    }

    text += line + '\n';
    return collectText(position + 1, text);
  };

  var getPositionOfNextHeading = function (position) {
    var line = lines[position];
    if (line === undefined) {
      return undefined;
    }
    if (isHeading(line)) {
      return position;
    }
    return getPositionOfNextHeading(position + 1);
  };

  var readNextEntry = function (position) {
    var headingPosition = getPositionOfNextHeading(position);
    var entry;
    if (headingPosition !== undefined) {
      entry = parseHeading(lines[headingPosition]);
      entry.text = collectText(headingPosition + 1);
      entries.push(entry);
      readNextEntry(headingPosition + 1);
    }
  };

  readNextEntry(0);

  return entries;
};

var extractRelease = function (changelog, version) {
  var changelogEntries = parseChangelog(changelog);
  var release = changelogEntries.find(function (entry) {
    return entry.version === version;
  });

  if (!release) {
    throw new Error("Can't find release version " + version + ' in the changelog');
  }

  return release;
};

module.exports = {
  insertRelease: insertRelease,
  extractRelease: extractRelease
};
