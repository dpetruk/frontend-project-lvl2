import _ from 'lodash';

const getValidValue = (value) => {
  if (_.isPlainObject(value)) return '[complex value]';

  return _.isString(value) ? `'${value}'` : value;
};

const formatList = (list, oldPath = '') => list
  .map((entry) => {
    const { key, type } = entry;
    const newPath = oldPath ? `${oldPath}.${key}` : `${key}`;

    switch (type) {
      case 'removed':
        return `Property '${newPath}' was removed`;

      case 'added': {
        const value = getValidValue(entry.value);
        return `Property '${newPath}' was added with value: ${value}`;
      }

      case 'updated': {
        const oldValue = getValidValue(entry.oldValue);
        const newValue = getValidValue(entry.newValue);
        return `Property '${newPath}' was updated. From ${oldValue} to ${newValue}`;
      }

      case 'unchanged':
        return null;

      case 'parent':
        return formatList(entry.children, newPath);

      default:
        throw new Error(`Unknown type '${type}'`);
    }
  })
  .filter((line) => line)
  .join('\n');

const getPlain = (diff) => formatList(diff);

export default getPlain;
