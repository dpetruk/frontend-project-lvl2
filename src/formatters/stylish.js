import _ from 'lodash';

const indentShiftSize = 4;
const spaceChar = ' ';
const minusMark = '- ';
const plusMark = '+ ';

const formatValue = (val, globalIndentSize) => {
  if (!_.isPlainObject(val)) {
    return val;
  }

  const localIndentSize = globalIndentSize + indentShiftSize;

  const lines = Object.entries(val)
    .map((entry) => {
      const [key, value] = entry;
      const formattedValue = formatValue(value, localIndentSize);
      return `${spaceChar.repeat(localIndentSize)}${key}: ${formattedValue}`;
    })
    .join('\n');

  const globalIndent = spaceChar.repeat(globalIndentSize);

  return `{\n${lines}\n${globalIndent}}`;
};

const formatListToStylish = (list, globalIndentSize = 0) => {
  const localIndentSize = globalIndentSize + indentShiftSize;

  const lines = list
    .map((entry) => {
      const { key, type } = entry;

      switch (type) {
        case 'removed': {
          const removedValue = formatValue(entry.value, localIndentSize);
          return `${_.padStart(minusMark, localIndentSize)}${key}: ${removedValue}`;
        }

        case 'added': {
          const addedValue = formatValue(entry.value, localIndentSize);
          return `${_.padStart(plusMark, localIndentSize)}${key}: ${addedValue}`;
        }

        case 'updated': {
          const oldValue = formatValue(entry.oldValue, localIndentSize);
          const newValue = formatValue(entry.newValue, localIndentSize);

          const oldEntry = `${_.padStart(minusMark, localIndentSize)}${key}: ${oldValue}`;
          const newEntry = `${_.padStart(plusMark, localIndentSize)}${key}: ${newValue}`;

          return `${oldEntry}\n${newEntry}`;
        }

        case 'unchanged': {
          const unchangedValue = formatValue(entry.value, localIndentSize);
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
