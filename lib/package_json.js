const jetpack = require('fs-jetpack');

const getPackage = () => {
  return jetpack.read('package.json', 'json');
};

const writePackage = (newContent) => {
  jetpack.write('package.json', newContent);
};

const getVersion = () => {
  return getPackage().version;
};

const setVersion = (newVersion) => {
  const pkg = getPackage();
  pkg.version = newVersion;
  writePackage(pkg);
};

const getScripts = () => {
  const scripts = getPackage().scripts;
  if (scripts === undefined) {
    return [];
  }
  return Object.keys(scripts).map((key) => {
    return {
      name: key,
      value: scripts[key],
    };
  });
};

module.exports = {
  getVersion,
  setVersion,
  getScripts,
};
