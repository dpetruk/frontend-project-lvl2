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

const areDeep = (value1, value2) => _.isPlainObject(value1) && _.isPlainObject(value2);

const genTypeForDifferent = (value1, value2) => {
  if (_.isUndefined(value2)) return 'removed';

  return _.isUndefined(value1) ? 'added' : 'updated';
};

const genType = (value1, value2) => {
  if (_.isEqual(value1, value2)) return 'unchanged';

  return genTypeForDifferent(value1, value2);
};

const genEntry = (val1, val2) => {
  const values = {
    unchanged: { value: val1 },
    removed: { value: val1 },
    added: { value: val2 },
    updated: { oldValue: val1, newValue: val2 },
  };
  const type = genType(val1, val2);

  return { type, ...values[type] };
};

const genIntDiff = (obj1, obj2) => {
  const keys = _.uniq(
    [
      ...Object.keys(obj1),
      ...Object.keys(obj2),
    ],
  )
    .sort();
  const arrWithEntries = keys
    .flatMap((key) => {
      const v1 = obj1[key];
      const v2 = obj2[key];

      const body = areDeep(v1, v2) ? { type: 'parent', children: genIntDiff(v1, v2) } : genEntry(v1, v2);

      return { key, ...body };
    });

  return arrWithEntries;
};

const formatters = {
  stylish: getStylish,
  plain: getPlain,
  json: (intDiff) => JSON.stringify(intDiff),
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
