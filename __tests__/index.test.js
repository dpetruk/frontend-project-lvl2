import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import generateDifference from '../src/index.js';

const getFixturesPath = (filename) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  return path.join(__dirname, '..', '__fixtures__', filename)
};

const expected = `{
  - follow: false
    host: hexlet.io
  - proxy: 123.234.53.22
  - timeout: 50
  + timeout: 20
  + verbose: true
}`;

test.each([
  ['f1.json', 'f2.json'],
  ['f1.yml', 'f2.yaml'],
  ['f1.ini', 'f2.ini'],
])('compare flat files (json, yaml, ini)', (filename1, filename2) => {
  const filepath1 = getFixturesPath(filename1);
  const filepath2 = getFixturesPath(filename2);
  expect(generateDifference(filepath1, filepath2)).toEqual(expected);
});
