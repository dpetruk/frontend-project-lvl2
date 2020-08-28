import _ from 'lodash';

const indentShift = 4;

const isArrWithEntries = (item) => _.isArray(item) && _.isPlainObject(item[0]);

const getArrWithEntries = (obj) => {
  const arr = Object.entries(obj);
  const arrWithEntries = arr.map((entry) => {
    const [key, value] = entry;
    return { [key]: value };
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

const formatToStylish = (arrWithEntries, globalIndentSize = 0) => {
  const formatEntry = (entry, localIndentSize) => {
    const [key] = Object.keys(entry);
    const value = getValidValue(entry[key]);

    const mark = getMark(entry.status);
    const indent = getIndent(localIndentSize, mark);
    const head = `${indent}${mark}${key}: `;
    const body = isArrWithEntries(value) ? formatToStylish(value, localIndentSize) : value;

    return `${head}${body}`;
  };

  const lines = arrWithEntries
    .map((entry) => formatEntry(entry, globalIndentSize + indentShift))
    .join('\n');

  const globalIndent = getIndent(globalIndentSize);

  return `{\n${lines}\n${globalIndent}}`;
};

export default formatToStylish;
export { isArrWithEntries };
