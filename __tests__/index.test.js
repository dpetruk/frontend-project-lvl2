import generateDifference from '../src/index.js';

const filepath1 = './__tests__/files/f1.json';
const filepath2 = './__tests__/files/f2.json';
const result = `{
  - follow: false
    host: hexlet.io
  - proxy: 123.234.53.22
  - timeout: 50
  + timeout: 20
  + verbose: true
}`;

test('genDiff', () => {
  expect(generateDifference(filepath1, filepath2)).toEqual(result);
});
