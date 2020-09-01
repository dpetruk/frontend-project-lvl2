import _ from 'lodash';

const indentShiftSize = 4;

const replaceUpdatedEntries = (list) => list
  .reduce((acc, entry) => {
    if (entry.type === 'updated') {
      const { key } = entry;
      return [
        ...acc,
        { key, value: entry.oldValue, type: 'removed' },
        { key, value: entry.newValue, type: 'added' },
      ];
    }

    return [...acc, entry];
  }, []);

const getMark = (type) => {
  const marks = {
    removed: '- ',
    added: '+ ',
    unchanged: '',
  };

  return marks[type] || '';
};

const genIndent = (indentSize, mark) => ' '.repeat(mark ? indentSize - mark.length : indentSize);

const getHead = (entry, localIndentSize) => {
  const { key, type } = entry;
  const mark = getMark(type);
  const indent = genIndent(localIndentSize, mark);

  return `${indent}${mark}${key}: `;
};

const getList = (obj) => {
  const list = Object.entries(obj)
    .map((entry) => {
      const [key, value] = entry;
      return { key, value };
    });

  return list;
};

const getValidValue = (entry) => {
  const { type, value } = entry;

  if (type === 'parent') return entry.children;

  return _.isPlainObject(value) ? getList(value) : value;
};

const isList = (value) => _.isPlainObject(_.head(value));

const formatList = (list, globalIndentSize = 0) => {
  const localIndentSize = globalIndentSize + indentShiftSize;

  const lines = replaceUpdatedEntries(list)
    .map((entry) => {
      const head = getHead(entry, localIndentSize);

      const value = getValidValue(entry);
      const body = isList(value) ? formatList(value, localIndentSize) : value;

      const str = `${head}${body}`;

      return str;
    })
    .join('\n');

  const globalIndent = genIndent(globalIndentSize);

  const stylishLines = `{\n${lines}\n${globalIndent}}`;

  return stylishLines;
};

const getStylish = (diff) => formatList(diff);

export default getStylish;
