import YAML from 'js-yaml';
import ini from 'ini';
import _ from 'lodash';

const getValidValue = (value) => (/^[0-9]+$/.test(value) ? Number(value) : value);

const fixNumParsing = (obj) => _.keys(obj)
  .reduce((acc, key) => {
    const value = getValidValue(obj[key]);
    return { ...acc, [key]: _.isPlainObject(value) ? fixNumParsing(value) : value };
  }, {});

const parseIniCorrectly = (string) => fixNumParsing(ini.parse(string));

const parsers = {
  ini: parseIniCorrectly,
  json: JSON.parse,
  yaml: YAML.safeLoad,
  yml: YAML.safeLoad,
};

const selectParser = (extension) => parsers[extension];

export default selectParser;
