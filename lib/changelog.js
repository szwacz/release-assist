const formatDate = (date) => {
  const year = date.getFullYear().toString();
  let month = (date.getMonth() + 1).toString();
  let day = date.getDate().toString();
  if (month.length === 1) {
    month = `0${month}`;
  }
  if (day.length === 1) {
    day = `0${day}`;
  }
  return `${year}-${month}-${day}`;
};

const insertRelease = (changelog, newEntry) => {
  const heading = `# ${newEntry.version} (${formatDate(newEntry.date)})`;
  const newEntryStr = `${heading}\n${newEntry.text}\n`;

  if (typeof changelog !== 'string') {
    return newEntryStr;
  }

  return `${newEntryStr}\n${changelog}`;
};

const parseChangelog = (changelog) => {
  const lines = changelog.split('\n');
  const entries = [];

  const isHeading = (line) => {
    return /^#/.test(line);
  };

  const parseHeading = (headingText) => {
    const version = /\d+\.\d+\.\d+/.exec(headingText)[0];
    const dateStr = /\d+-\d+-\d+/.exec(headingText)[0];
    const dateParts = dateStr.split('-').map(date => parseInt(date, 10));
    const date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
    return {
      version,
      date,
    };
  };

  const collectText = (position, text) => {
    const line = lines[position];
    if (text === undefined) {
      text = '';
    }

    if (isHeading(line) || (line === '' && isHeading(lines[0]))) {
      return text;
    }

    text += `${line}\n`;
    return collectText(position + 1, text);
  };

  const getPositionOfNextHeading = (position) => {
    const line = lines[position];
    if (line === undefined) {
      return undefined;
    }
    if (isHeading(line)) {
      return position;
    }
    return getPositionOfNextHeading(position + 1);
  };

  const readNextEntry = (position) => {
    const headingPosition = getPositionOfNextHeading(position);
    if (headingPosition !== undefined) {
      const entry = parseHeading(lines[headingPosition]);
      entry.text = collectText(headingPosition + 1);
      entries.push(entry);
      readNextEntry(headingPosition + 1);
    }
  };

  readNextEntry(0);

  return entries;
};

const extractRelease = (changelog, version) => {
  const changelogEntries = parseChangelog(changelog);
  const release = changelogEntries.find(entry => entry.version === version);

  if (!release) {
    throw new Error(`Can't find release version ${version} in the changelog`);
  }

  return release;
};

module.exports = {
  insertRelease,
  extractRelease,
};
