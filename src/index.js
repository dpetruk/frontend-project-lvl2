import fs from 'fs';
import _ from 'lodash';
import path from 'path';
import parsers from './parsers.js';

const getObject = (filepath) => {
  const str = fs.readFileSync(filepath, 'utf8');
  const ext = path.extname(filepath).slice(1);

  return parsers[ext](str);
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

      if (_.isEqual(value1, value2)) {
        return { [key]: value1 };
      }

      if (_.isPlainObject(value1) && _.isPlainObject(value2)) {
        return { [key]: genRawDiff(value1, value2) };
      }

      return [
        _.isUndefined(value1) ? null : { [key]: value1, status: 'deleted' },
        _.isUndefined(value2) ? null : { [key]: value2, status: 'added' },
      ]
        .filter((item) => item);
    });
  return arrWithEntries;
};

const getArrWithEntries = (obj) => {
  const arr = Object.entries(obj);
  const arrWithEntries = arr.map((entry) => {
    const [key, value] = entry;
    return { [key]: value };
  });
  return arrWithEntries;
};

const marks = {
  deleted: '- ',
  added: '+ ',
};

const indentShift = 4;

const isArrWithEntries = (item) => _.isArray(item) && _.isPlainObject(item[0]);

const formatToStylish = (arrWithEntries, globalIndentSize = 0) => {
  const formatEntry = (entry, localIndentSize) => {
    const [key] = Object.keys(entry);
    const value = _.isPlainObject(entry[key]) ? getArrWithEntries(entry[key]) : entry[key];

    const mark = marks[entry.status] || '';
    const indent = ' '.repeat(mark ? localIndentSize - mark.length : localIndentSize);
    const head = `${indent}${mark}${key}: `;
    const body = isArrWithEntries(value) ? formatToStylish(value, localIndentSize) : value;

    return `${head}${body}`;
  };

  const lines = arrWithEntries
    .map((entry) => formatEntry(entry, globalIndentSize + indentShift))
    .join('\n');

  const globalIndent = ' '.repeat(globalIndentSize);

  return `{\n${lines}\n${globalIndent}}`;
};

const formatter = {
  stylish: formatToStylish,
  plain: 3,
};

const genDiff = (filepath1, filepath2, outputFormat = 'stylish') => {
  const rawDiff = genRawDiff(
    getObject(filepath1),
    getObject(filepath2),
  );
  return formatter[outputFormat](rawDiff);
};

export default genDiff;
