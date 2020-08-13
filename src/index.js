import program from 'commander';
import generateDifference from './generateDifference.js';

const runProgram = () => {
  program
    .version('0.0.1')
    .description('Compares two configuration files and shows a difference.')
    .option('-f, --format [type]', 'output format')
    .arguments('<filepath1> <filepath2>')
    .action((filepath1, filepath2) => console.log(generateDifference(filepath1, filepath2)));

  return program;
};

export default runProgram;
