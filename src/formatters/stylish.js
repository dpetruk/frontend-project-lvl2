import _ from 'lodash';

const indentShiftSize = 4;

const isArrWithEntries = (item) => _.isArray(item) && _.isPlainObject(item[0]);

const replaceUpdatedEntries = (arrWithEntries) => arrWithEntries
  .reduce((acc, entry) => {
    if (entry.status === 'updated') {
      const { key } = entry;
      return [
        ...acc,
        { key, value: entry.oldValue, status: 'removed' },
        { key, value: entry.newValue, status: 'added' },
      ];
    }
    return [...acc, entry];
  }, []);

const getArrWithEntries = (obj) => {
  const arr = Object.entries(obj);
  const arrWithEntries = arr.map((entry) => {
    const [key, value] = entry;
    return { key, value };
  });
  return arrWithEntries;
};

const getValidValue = (val) => (_.isPlainObject(val) ? getArrWithEntries(val) : val);

const getMark = (status) => {
  const marks = {
    removed: '- ',
    added: '+ ',
  };
  return marks[status] || '';
};

const getIndent = (indentSize, mark) => ' '.repeat(mark ? indentSize - mark.length : indentSize);

const getHead = (entry, localIndentSize) => {
  const { key, status } = entry;
  const mark = getMark(status);
  const indent = getIndent(localIndentSize, mark);

  return `${indent}${mark}${key}: `;
};

const formatToStylish = (arrWithEntries, globalIndentSize = 0) => {
  const localIndentSize = globalIndentSize + indentShiftSize;

  const lines = replaceUpdatedEntries(arrWithEntries)
    .map((entry) => {
      const head = getHead(entry, localIndentSize);

      const value = getValidValue(entry.value);
      const body = isArrWithEntries(value) ? formatToStylish(value, localIndentSize) : value;

      return `${head}${body}`;
    })
    .join('\n');

  const globalIndent = getIndent(globalIndentSize);

  return `{\n${lines}\n${globalIndent}}`;
};

export default formatToStylish;
export { isArrWithEntries };
