import program from 'commander';

const generateDifference = () => {
  program
    .version('0.0.1')
    .description('Compares two configuration files and shows a difference.');

  return program;
};

export default generateDifference;