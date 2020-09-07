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

const genIndent = (indentSize, mark = '') => ' '.repeat(indentSize - mark.length);

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
  const newList = replaceUpdatedEntries(list);

  const linesArr = newList
    .map((entry) => {
      const { key, type } = entry;
      const mark = getMark(type);
      const indent = genIndent(localIndentSize, mark);
      const head = `${indent}${mark}${key}: `;

      const value = getValidValue(entry);
      const body = isList(value) ? formatList(value, localIndentSize) : value;

      return `${head}${body}`;
    });

  const lines = linesArr.join('\n');
  const globalIndent = genIndent(globalIndentSize);

  return `{\n${lines}\n${globalIndent}}`;
};

const getStylish = (diff) => formatList(diff);

export default getStylish;
