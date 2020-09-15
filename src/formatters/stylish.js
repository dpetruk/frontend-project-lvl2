import _ from 'lodash';

const indentShiftSize = 4;
const spaceChar = ' ';
const minusMark = '- ';
const plusMark = '+ ';

const getList = (obj) => {
  const list = Object.entries(obj)
    .map((entry) => {
      const [key, value] = entry;
      return { key, type: 'embedded in value', value };
    });

  return list;
};

const formatListToStylish = (list, globalIndentSize = 0) => {
  const localIndentSize = globalIndentSize + indentShiftSize;

  const getValidValue = (val) => {
    if (!_.isPlainObject(val)) {
      return val;
    }
    const embeddedList = getList(val);
    return formatListToStylish(embeddedList, localIndentSize);
  };

  const lines = list
    .map((entry) => {
      const { key, type } = entry;

      switch (type) {
        case 'removed': {
          const removedValue = getValidValue(entry.value);
          return `${_.padStart(minusMark, localIndentSize)}${key}: ${removedValue}`;
        }

        case 'added': {
          const addedValue = getValidValue(entry.value);
          return `${_.padStart(plusMark, localIndentSize)}${key}: ${addedValue}`;
        }

        case 'updated': {
          const oldValue = getValidValue(entry.oldValue);
          const newValue = getValidValue(entry.newValue);

          const oldEntry = `${_.padStart(minusMark, localIndentSize)}${key}: ${oldValue}`;
          const newEntry = `${_.padStart(plusMark, localIndentSize)}${key}: ${newValue}`;

          return `${oldEntry}\n${newEntry}`;
        }

        case 'unchanged': {
          const unchangedValue = getValidValue(entry.value);
          return `${spaceChar.repeat(localIndentSize)}${key}: ${unchangedValue}`;
        }

        case 'parent': {
          const { children } = entry;
          const parentValue = formatListToStylish(children, localIndentSize);
          return `${spaceChar.repeat(localIndentSize)}${key}: ${parentValue}`;
        }

        case 'embedded in value':
          return `${spaceChar.repeat(localIndentSize)}${key}: ${getValidValue(entry.value)}`;

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
