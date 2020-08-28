import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import fs from 'fs';
import genDiff from '../src/index.js';

const getFixturesPath = (filename) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  return path.join(__dirname, '..', '__fixtures__', filename)
};
const filepath1 = getFixturesPath('f1.json');
const filepath2 = getFixturesPath('f2.json');

test.each([
  'stylish',
  'plain'
])(`compare deep files (stylish, plain)`, (formatter) => {
  const expected = fs.readFileSync(getFixturesPath(`expected_${formatter}`), 'utf8');
  expect(genDiff(filepath1, filepath2, formatter)).toEqual(expected);
});
