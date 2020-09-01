import _ from 'lodash';

const isNotUnchanged = (entry) => entry.type !== 'unchanged';

const genNewPath = (path, key) => (path ? `${path}.${key}` : `${key}`);

const isParent = (type) => type === 'parent';

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
  const plainLines = list
    .filter(isNotUnchanged)
    .reduce((acc, entry) => {
      const { key, type } = entry;
      const { path } = acc;
      const newPath = genNewPath(path, key);

      const str = isParent(type) ? formatList(entry.children, newPath) : genLine(entry, newPath);

      return { lines: [...acc.lines, str], path };
    }, { lines: [], path: ancestry })
    .lines
    .join('\n');

  return plainLines;
};

const getPlain = (diff) => formatList(diff);

export default getPlain;
