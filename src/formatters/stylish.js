import _ from 'lodash';

const indentShiftSize = 4;
const spaceChar = ' ';
const minusMark = '- ';
const plusMark = '+ ';

const getList = (obj) => {
  const list = Object.entries(obj)
    .map((entry) => {
      const [key, value] = entry;
      return { key, value };
    });

  return list;
};

const formatListToStylish = (list, globalIndentSize = 0) => {
  const localIndentSize = globalIndentSize + indentShiftSize;

  const formatValue = (val) => {
    if (!_.isPlainObject(val)) {
      return val;
    }
    return formatListToStylish(getList(val), localIndentSize);
  };

  const lines = list
    .map((entry) => {
      const { key, type } = entry;
      if (!type) {
        return `${spaceChar.repeat(localIndentSize)}${key}: ${formatValue(entry.value)}`;
      }

      switch (type) {
        case 'removed': {
          const removedValue = formatValue(entry.value);
          return `${_.padStart(minusMark, localIndentSize)}${key}: ${removedValue}`;
        }

        case 'added': {
          const addedValue = formatValue(entry.value);
          return `${_.padStart(plusMark, localIndentSize)}${key}: ${addedValue}`;
        }

        case 'updated': {
          const oldValue = formatValue(entry.oldValue);
          const newValue = formatValue(entry.newValue);

          const oldEntry = `${_.padStart(minusMark, localIndentSize)}${key}: ${oldValue}`;
          const newEntry = `${_.padStart(plusMark, localIndentSize)}${key}: ${newValue}`;

          return `${oldEntry}\n${newEntry}`;
        }

        case 'unchanged': {
          const unchangedValue = formatValue(entry.value);
          return `${spaceChar.repeat(localIndentSize)}${key}: ${unchangedValue}`;
        }

        case 'parent': {
          const { children } = entry;
          const parentValue = formatListToStylish(children, localIndentSize);
          return `${spaceChar.repeat(localIndentSize)}${key}: ${parentValue}`;
        }

        default: {
          throw new Error(`Unknown type '${type}'`);
        }
      }
    })
    .join('\n');

  const globalIndent = spaceChar.repeat(globalIndentSize);

  return `{\n${lines}\n${globalIndent}}`;
};

const getStylish = (diff) => formatListToStylish(diff);

export default getStylish;
