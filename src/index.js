import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import selectParser from './parsers.js';
import getStylish from './formatters/stylish.js';
import getPlain from './formatters/plain.js';

const getObj = (filepath) => {
  const str = fs.readFileSync(filepath, 'utf8');
  const extension = _.trimStart(path.extname(filepath), '.');
  const parse = selectParser(extension);

  return parse(str);
};

const genIntDiff = (obj1, obj2) => {
  const keys = Object.keys({ ...obj1, ...obj2 }).sort();

  const arrWithEntries = keys
    .flatMap((key) => {
      const val1 = obj1[key];
      const val2 = obj2[key];

      if (_.isPlainObject(val1) && _.isPlainObject(val2)) {
        return { key, type: 'parent', children: genIntDiff(val1, val2) };
      }

      if (_.isEqual(val1, val2)) {
        return { key, type: 'unchanged', value: val1 };
      }

      if (_.isUndefined(val2)) {
        return { key, type: 'removed', value: val1 };
      }

      if (_.isUndefined(val1)) {
        return { key, type: 'added', value: val2 };
      }

      return {
        key, type: 'updated', oldValue: val1, newValue: val2,
      };
    });

  return arrWithEntries;
};

const formatters = {
  stylish: getStylish,
  plain: getPlain,
  json: JSON.stringify,
};

const selectFormatter = (name) => {
  if (!_.has(formatters, name)) {
    const errorMessage = `Unknown formatter name '${name}'.`;
    return () => errorMessage;
  }

  return formatters[name];
};

const genDiff = (filepath1, filepath2, outputFormat = 'stylish') => {
  const obj1 = getObj(filepath1);
  const obj2 = getObj(filepath2);

  const intDiff = genIntDiff(obj1, obj2);

  const genFormattedDiff = selectFormatter(outputFormat);

  return genFormattedDiff(intDiff);
};

export default genDiff;
