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
  ['f1_deep.json', 'f2_deep.json'],
  ['f1_deep.yml', 'f2_deep.yaml'],
])('compare deep files (json, yml)', (filename1, filename2) => {
  const expected = fs.readFileSync(getFixturesPath('expected_deep'), 'utf8');
  const filepath1 = getFixturesPath(filename1);
  const filepath2 = getFixturesPath(filename2);
  expect(genDiff(filepath1, filepath2)).toEqual(expected);
});
