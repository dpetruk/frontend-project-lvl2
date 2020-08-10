import program from 'commander';

const generateDifference = () => {
  program
    .version('0.0.1')
    .description('Compares two configuration files and shows a difference.')
    .option('-f, --format [type]', 'output format')
    .arguments('<filepath1> <filepath2>');

  return program;
};

export default generateDifference;
