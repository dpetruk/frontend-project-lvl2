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

const areBothDeep = (value1, value2) => _.isPlainObject(value1) && _.isPlainObject(value2);

const getEntryWithStatus = (key, value, entryStatus) => {
  if (_.isUndefined(value)) {
    return null;
  }

  return { [key]: value, status: [entryStatus] };
};

const getDiffEntry = (key, value1, value2) => {
  if (_.isEqual(value1, value2)) {
    return { [key]: value1 };
  }
  return [
    getEntryWithStatus(key, value1, 'removed'),
    getEntryWithStatus(key, value2, 'added'),
  ]
    .filter((item) => item);
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
      const value1 = obj1[key];
      const value2 = obj2[key];

      if (areBothDeep(value1, value2)) {
        return { [key]: genRawDiff(value1, value2) };
      }

      const diffEntry = getDiffEntry(key, value1, value2);

      return diffEntry;
    });
  return arrWithEntries;
};

const format = (name) => {
  const formatter = {
    stylish: formatToStylish,
    plain: formatToPlain,
  };

  if (!_.has(formatter, name)) {
    const errorMessage = `Unknown formatter name '${name}'.`;
    return () => errorMessage;
  }

  return formatter[name];
};

const genDiff = (filepath1, filepath2, outputFormat = 'stylish') => {
  const rawDiff = genRawDiff(
    getObject(filepath1),
    getObject(filepath2),
  );
  return format(outputFormat)(rawDiff);
};

export default genDiff;
