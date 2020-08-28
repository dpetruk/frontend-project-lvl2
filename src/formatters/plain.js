import _ from 'lodash';
import { isArrWithEntries } from './stylish.js';

const getKeysOfUpdatedEntries = (arrWithEntries) => _.uniq(
  arrWithEntries
    .map((entry) => _.head(Object.keys(entry)))
    .filter((el, index, keys) => index !== keys.lastIndexOf(el)),
);

const formatValue = (value) => {
  if (_.isPlainObject(value)) return '[complex value]';
  return _.isString(value) ? `'${value}'` : value;
};

const formatProperty = (ancestryOfKey, key) => (ancestryOfKey ? `${ancestryOfKey}.${key}` : `${key}`);

const getLineForStatus = (currentStatus, property, value, obsoleteValue) => {
  const status = obsoleteValue ? 'updated' : currentStatus;
  const ending = {
    removed: 'removed',
    added: `added with value: ${value}`,
    updated: `updated. From ${obsoleteValue} to ${value}`,
  };
  return `Property '${property}' was ${ending[status]}`;
};

const formatToPlain = (arrWithEntries, ancestry = '') => {
  const keysOfUpdatedEntries = getKeysOfUpdatedEntries(arrWithEntries);

  const plainLines = arrWithEntries.reduce((acc, entry) => {
    const [key] = Object.keys(entry);
    const value = formatValue(entry[key]);

    const property = formatProperty(acc.path, key);

    const samePath = { path: acc.path };

    const isObsoleteEntry = keysOfUpdatedEntries.includes(key) && _.isUndefined(acc.obsoleteValue);

    if (isObsoleteEntry) {
      return { ...acc, obsoleteValue: value };
    }

    if (_.has(entry, 'status')) {
      const newLine = getLineForStatus(entry.status, property, value, acc.obsoleteValue);
      return { lines: [...acc.lines, newLine], ...samePath };
    }

    if (isArrWithEntries(value)) {
      return { lines: [...acc.lines, formatToPlain(value, property)], ...samePath };
    }

    return acc;
  }, { lines: [], path: ancestry }).lines;

  return plainLines.join('\n');
};

export default formatToPlain;
