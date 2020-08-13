import fs from 'fs';
import _ from 'lodash';

const getEntries = (filepath) => {
  const str = fs.readFileSync(filepath);
  const obj = JSON.parse(str, 'utf8');
  const entries = Object.entries(obj);
  return entries;
};

const format = (array, mark = ' ') => array.map((entry) => `  ${mark} ${entry.join(': ')}`);

const generateDifference = (filepath1, filepath2) => {
  if (!(fs.existsSync(filepath1) && fs.existsSync(filepath2))) {
    return 'At least one path is not correct';
  }

  const entries1 = getEntries(filepath1);
  const entries2 = getEntries(filepath2);

  const unchanged = _.intersectionWith(entries1, entries2, _.isEqual);
  const deleted = _.differenceWith(entries1, unchanged, _.isEqual);
  const added = _.differenceWith(entries2, unchanged, _.isEqual);

  const formattedDiff = _.sortBy(
    [
      ...format(unchanged),
      ...format(deleted, '-'),
      ...format(added, '+'),
    ], (entry) => entry.slice(4, entry.indexOf(':')),
  ).join('\n');

  return `{\n${formattedDiff}\n}`;
};

/*
Другой вариант:
Получил объекты из каждого файла
Получил все ключи
Определил массив result
Прохожу по ключам и собираю массив result:
  Если ключ есть в каждом объекте, то:
    Если значения совпадают, то:
      В массив добавляю строку с форматированием (без + или -)
    Иначе:
      В массив добавляю строку, где есть ключ и значение из первого файла. Форматирование с '-'.
      Также добавляю туда строку, где есть ключ и значение из второго файла. Форматирование с '+'.
  Иначе (если ключ не каждом объекте):
    Если ключ есть только в первом файле, то добавляю в массив строку (ключ: значение) с '-'.
    Если ключ есть только во втором файле, то добавляю в массив строку (ключ: значение) с '+'.
Собирать могу в массив, чтобы потом заджойнить с `\n` и добавить фигурные скобки.
*/

export default generateDifference;
