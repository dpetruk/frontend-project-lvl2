import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import selectParser from './parsers.js';
import selectFormatter from './formatters/index.js';

const getParsedContent = (filepath) => {
  const extension = _.trimStart(path.extname(filepath), '.');
  const parse = selectParser(extension);

  const content = fs.readFileSync(filepath, 'utf8');

  return parse(content);
};

const genInternalDiff = (obj1, obj2) => {
  const keys = _.union(_.keys(obj1), _.keys(obj2)).sort();

  const entries = keys
    .flatMap((key) => {
      const val1 = obj1[key];
      const val2 = obj2[key];

      if (!_.has(obj2, key)) {
        return { key, type: 'removed', value: val1 };
      }

      if (!_.has(obj1, key)) {
        return { key, type: 'added', value: val2 };
      }

      if (_.isPlainObject(val1) && _.isPlainObject(val2)) {
        return { key, type: 'parent', children: genInternalDiff(val1, val2) };
      }

      if (_.isEqual(val1, val2)) {
        return { key, type: 'unchanged', value: val1 };
      }

      return {
        key, type: 'updated', oldValue: val1, newValue: val2,
      };
    });

  return entries;
};

const genDiff = (filepath1, filepath2, outputFormat = 'stylish') => {
  const obj1 = getParsedContent(filepath1);
  const obj2 = getParsedContent(filepath2);

  const internalDiff = genInternalDiff(obj1, obj2);

  const genFormattedDiff = selectFormatter(outputFormat);
  const formattedDiff = genFormattedDiff(internalDiff);

  return formattedDiff;
};

export default genDiff;
