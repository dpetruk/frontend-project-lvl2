import fs from 'fs';
import _ from 'lodash';

const getEntries = (filepath) => {
  const str = fs.readFileSync(filepath);
  const obj = JSON.parse(str, 'utf8');
  const entries = Object.entries(obj);
  return entries;
};

const format = (array, mark = ' ') => array.map((entry) => `  ${mark} ${entry.join(': ')}`);

const generateDifference = (filepath1, filepath2) => {
  const entries1 = getEntries(filepath1);
  const entries2 = getEntries(filepath2);

  const unchanged = _.intersectionWith(entries1, entries2, _.isEqual);
  const deleted = _.differenceWith(entries1, unchanged, _.isEqual);
  const added = _.differenceWith(entries2, unchanged, _.isEqual);

  const formattedDiff = _.sortBy(
    [
      ...format(unchanged),
      ...format(deleted, '-'),
      ...format(added, '+'),
    ],
    (entry) => entry.slice(4, entry.indexOf(':')),
  ).join('\n');

  return `{\n${formattedDiff}\n}`;
};

export default generateDifference;
