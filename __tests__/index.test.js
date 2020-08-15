import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import generateDifference from '../src/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getFixturesPath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);

const filepath1 = getFixturesPath('f1.json');
const filepath2 = getFixturesPath('f2.json');

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
