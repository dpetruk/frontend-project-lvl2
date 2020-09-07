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

test.each([
  ['json', 'stylish'],
  ['yml', 'stylish'],
  ['ini', 'stylish'],
  ['json', 'plain'],
  ['yml', 'plain'],
  ['ini', 'plain'],
  ['json', 'json'],
  ['yml', 'json'],
  ['ini', 'json'],
])(`compare deep files (input: %s, output: %s)`, (inputExt, formatter) => {
  const filepath1 = getFixturesPath(`f1.${inputExt}`);
  const filepath2 = getFixturesPath(`f2.${inputExt}`);

  const expected = fs.readFileSync(getFixturesPath(`expected_${formatter}`), 'utf8');

  expect(genDiff(filepath1, filepath2, formatter)).toEqual(expected);
});
