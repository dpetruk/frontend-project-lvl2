import YAML from 'js-yaml';
import ini from 'ini';
import _ from 'lodash';

const isNumberString = (value) => /^\d+$/.test(value);

const convertNumStringsToNums = (parsedContent) => _.keys(parsedContent)
  .reduce((acc, key) => {
    const parsedValue = parsedContent[key];
    const value = isNumberString(parsedValue) ? Number(parsedValue) : parsedValue;
    return { ...acc, [key]: _.isPlainObject(value) ? convertNumStringsToNums(value) : value };
  }, {});

const parseIniCorrectly = (string) => convertNumStringsToNums(ini.parse(string));

const parsers = {
  ini: parseIniCorrectly,
  json: JSON.parse,
  yaml: YAML.safeLoad,
  yml: YAML.safeLoad,
};

const selectParser = (extension) => parsers[extension];

export default selectParser;
