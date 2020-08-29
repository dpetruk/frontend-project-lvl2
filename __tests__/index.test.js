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

const expected_stylish = fs.readFileSync(getFixturesPath(`expected_stylish`), 'utf8');
const expected_plain = fs.readFileSync(getFixturesPath(`expected_plain`), 'utf8');
const expected_json = fs.readFileSync(getFixturesPath(`expected_json`), 'utf8');

const json1 = getFixturesPath('f1.json');
const json2 = getFixturesPath('f2.json');
const yaml1 = getFixturesPath('f1.yml');
const yaml2 = getFixturesPath('f2.yaml');
const ini1 = getFixturesPath('f1.ini');
const ini2 = getFixturesPath('f2.ini');

test.each([
  ['f1.json', 'f2.json', 'stylish'],
  ['f1.yml', 'f2.yaml', 'stylish'],
  ['f1.ini', 'f2.ini', 'stylish'],
  ['f1.json', 'f2.json', 'plain'],
  ['f1.yml', 'f2.yaml', 'plain'],
  ['f1.ini', 'f2.ini', 'plain'],
  ['f1.json', 'f2.json', 'json'],
  ['f1.yml', 'f2.yaml', 'json'],
  ['f1.ini', 'f2.ini', 'json'],
])(`compare deep files (%s, %s with %s)`, (filename1, filename2, formatter) => {
  const filepath1 = getFixturesPath(filename1);
  const filepath2 = getFixturesPath(filename2);

  const expected = fs.readFileSync(getFixturesPath(`expected_${formatter}`), 'utf8');

  expect(genDiff(filepath1, filepath2, formatter)).toEqual(expected);
});
