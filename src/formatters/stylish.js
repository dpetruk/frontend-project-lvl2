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

  const lines = _.entries(val)
    .map(([key, value]) => {
      const formattedValue = formatValue(value, localIndentSize);
      return `${spaceChar.repeat(localIndentSize)}${key}: ${formattedValue}`;
    })
    .join('\n');

  const globalIndent = spaceChar.repeat(globalIndentSize);

  return `{\n${lines}\n${globalIndent}}`;
};

const formatListToStylish = (list, globalIndentSize) => {
  const localIndentSize = globalIndentSize + indentShiftSize;

  const lines = list
    .map(({
      type, key, value, children,
    }) => {
      switch (type) {
        case 'removed':
          return `${minusMark.padStart(localIndentSize)}${key}: ${formatValue(value, localIndentSize)}`;
        case 'added':
          return `${plusMark.padStart(localIndentSize)}${key}: ${formatValue(value, localIndentSize)}`;
        case 'updated': {
          const oldEntry = `${minusMark.padStart(localIndentSize)}${key}: ${formatValue(value.oldValue, localIndentSize)}`;
          const newEntry = `${plusMark.padStart(localIndentSize)}${key}: ${formatValue(value.newValue, localIndentSize)}`;
          return `${oldEntry}\n${newEntry}`;
        }
        case 'unchanged':
          return `${spaceChar.repeat(localIndentSize)}${key}: ${formatValue(value, localIndentSize)}`;
        case 'parent':
          return `${spaceChar.repeat(localIndentSize)}${key}: ${formatListToStylish(children, localIndentSize)}`;
        default:
          throw new Error(`Unknown type '${type}'`);
      }
    });

  const globalIndent = spaceChar.repeat(globalIndentSize);

  return `{\n${lines.join('\n')}\n${globalIndent}}`;
};

const getStylish = (diff) => formatListToStylish(diff, 0);

export default getStylish;
