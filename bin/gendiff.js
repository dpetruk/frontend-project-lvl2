#!/usr/bin/env node
import runProgram from '../src/index.js';

const program = runProgram();

program.parse(process.argv);
