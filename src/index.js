import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import parsers from './parsers.js';
import formatToStylish from './formatters/stylish.js';
import formatToPlain from './formatters/plain.js';

const getObject = (filepath) => {
  const str = fs.readFileSync(filepath, 'utf8');
  const ext = path.extname(filepath).slice(1);

  return parsers[ext](str);
};

const areDeep = (value1, value2) => _.isPlainObject(value1) && _.isPlainObject(value2);

const identifyDefined = (value1, value2) => {
  if (_.isUndefined(value2)) return 'only first value is defined';

  return _.isUndefined(value1) ? 'only second value is defined' : 'both are defined';
};

const getStatus = (value1, value2) => {
  if (_.isEqual(value1, value2)) return 'unchanged';
  const statusForDefined = {
    'only first value is defined': 'removed',
    'only second value is defined': 'added',
    'both are defined': 'updated',
  };
  return statusForDefined[identifyDefined(value1, value2)];
};

const getEntry = (val1, val2) => {
  const values = {
    unchanged: { value: val1 },
    removed: { value: val1 },
    added: { value: val2 },
    updated: { oldValue: val1, newValue: val2 },
  };
  const status = getStatus(val1, val2);

  return { ...values[status], status };
};

const genRawDiff = (obj1, obj2) => {
  const keys = _.uniq(
    [
      ...Object.keys(obj1),
      ...Object.keys(obj2),
    ],
  )
    .sort();

  const arrWithEntries = keys
    .flatMap((key) => {
      const val1 = obj1[key];
      const val2 = obj2[key];

      const body = areDeep(val1, val2) ? { value: genRawDiff(val1, val2) } : getEntry(val1, val2);

      return { key, ...body };
    });
  return arrWithEntries;
};

const formatters = {
  stylish: formatToStylish,
  plain: formatToPlain,
  json: (rawDiff) => JSON.stringify(rawDiff),
};

const format = (name) => {
  if (!_.has(formatters, name)) {
    const errorMessage = `Unknown formatter name '${name}'.`;
    return () => errorMessage;
  }

  return formatters[name];
};

const genDiff = (filepath1, filepath2, outputFormat = 'stylish') => {
  const rawDiff = genRawDiff(
    getObject(filepath1),
    getObject(filepath2),
  );
  return format(outputFormat)(rawDiff);
};

export default genDiff;
