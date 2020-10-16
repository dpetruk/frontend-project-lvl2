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

const genInternalDiff = (parsedContent1, parsedContent2) => {
  const keys = _.union(_.keys(parsedContent1), _.keys(parsedContent2)).sort();

  const entries = keys.map((key) => {
    if (!_.has(parsedContent2, key)) {
      return { type: 'removed', key, value: parsedContent1[key] };
    }

    if (!_.has(parsedContent1, key)) {
      return { type: 'added', key, value: parsedContent2[key] };
    }

    const oldValue = parsedContent1[key];
    const newValue = parsedContent2[key];

    if (_.isPlainObject(oldValue) && _.isPlainObject(newValue)) {
      return { key, type: 'parent', children: genInternalDiff(oldValue, newValue) };
    }

    if (_.isEqual(oldValue, newValue)) {
      return { key, type: 'unchanged', value: oldValue };
    }

    return {
      key, type: 'updated', value: { oldValue, newValue },
    };
  });

  return entries;
};

const genDiff = (filepath1, filepath2, outputFormat = 'stylish') => {
  const parsedContent1 = getParsedContent(filepath1);
  const parsedContent2 = getParsedContent(filepath2);

  const internalDiff = genInternalDiff(parsedContent1, parsedContent2);

  const genFormattedDiff = selectFormatter(outputFormat);
  const formattedDiff = genFormattedDiff(internalDiff);

  return formattedDiff;
};

export default genDiff;
