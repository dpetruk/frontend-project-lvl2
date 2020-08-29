import _ from 'lodash';

const isNotUnchanged = (entry) => entry.status !== 'unchanged';
const formatValue = (value) => {
  if (_.isPlainObject(value)) return '[complex value]';
  return _.isString(value) ? `'${value}'` : value;
};

const getPath = (ancestry, key) => (ancestry ? `${ancestry}.${key}` : `${key}`);

const getLineForStatus = (entry, path) => {
  const { key, status } = entry;
  const value = formatValue(entry.value);

  const oldValue = formatValue(entry.oldValue);
  const newValue = formatValue(entry.newValue);

  const ending = {
    removed: 'removed',
    added: `added with value: ${value}`,
    updated: `updated. From ${oldValue} to ${newValue}`,
  };

  return `Property '${getPath(path, key)}' was ${ending[status]}`;
};

const formatToPlain = (arrWithEntries, ancestry = '') => {
  const plainLines = arrWithEntries
    .filter(isNotUnchanged)
    .reduce((acc, entry) => {
      const { path } = acc;

      const { key, status } = entry;

      const newLines = status
        ? getLineForStatus(entry, path)
        : formatToPlain(formatValue(entry.value), getPath(path, key));

      return { lines: [...acc.lines, newLines], path };
    }, { lines: [], path: ancestry }).lines;

  return plainLines.join('\n');
};

export default formatToPlain;
