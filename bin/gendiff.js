#!/usr/bin/env node

import program from 'commander';

program
  .version('0.0.1')
  .description('Compares two configuration files and shows a difference.');

// Почему program.parse работает и без process.argv? Для чего указывать process.argv?
program.parse(process.argv);