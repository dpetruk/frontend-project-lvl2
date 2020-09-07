import _ from 'lodash';

const genValid = (value) => {
  if (_.isPlainObject(value)) return '[complex value]';

  return _.isString(value) ? `'${value}'` : value;
};

const genLine = (entry, newPath) => {
  const { type } = entry;
  const value = genValid(entry.value);

  const oldValue = genValid(entry.oldValue);
  const newValue = genValid(entry.newValue);

  const ending = {
    removed: 'removed',
    added: `added with value: ${value}`,
    updated: `updated. From ${oldValue} to ${newValue}`,
  };

  return `Property '${newPath}' was ${ending[type]}`;
};

const formatList = (list, ancestry = '') => {
  const plainLinesArr = list
    .filter((entry) => entry.type !== 'unchanged')
    .reduce((acc, entry) => {
      const { key, type } = entry;
      const { path, lines } = acc;
      const newPath = path ? `${path}.${key}` : `${key}`;

      const str = (type === 'parent') ? formatList(entry.children, newPath) : genLine(entry, newPath);

      return { lines: [...lines, str], path };
    }, { lines: [], path: ancestry })
    .lines;

  const plainLines = plainLinesArr.join('\n');

  return plainLines;
};

const getPlain = (diff) => formatList(diff);

export default getPlain;
