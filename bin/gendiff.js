#!/usr/bin/env node
import generateDifference from '../src/index.js';

const program = generateDifference();

program.parse(process.argv);