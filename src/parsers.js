import YAML from 'js-yaml';
import ini from 'ini';
import _ from 'lodash';

const getValidValue = (value) => (/^[0-9]+$/.test(value) ? Number(value) : value);

const fixNumParsing = (obj) => {
  const keys = Object.keys(obj);
  return keys
    .reduce((acc, key) => {
      const value = getValidValue(obj[key]);
      return { ...acc, [key]: _.isPlainObject(value) ? fixNumParsing(value) : value };
    }, {});
};

const parsers = {
  ini: (string) => fixNumParsing(ini.parse(string)),
  json: (string) => JSON.parse(string),
  yaml: (string) => YAML.safeLoad(string),
  yml: (string) => YAML.safeLoad(string),
};

const selectParser = (extension) => parsers[extension];

export default selectParser;
