#!/usr/bin/env node

/**
 * STARLIN CLI
 * Command-line interface for Starlin framework
 */

const { program } = require('commander');
const create = require('../lib/cli/create');
const dev = require('../lib/cli/dev');

program
    .name('starlin')
    .description('Starlin Framework CLI')
    .version('1.0.0');

// Create new project
program
    .command('create <project-name>')
    .description('Create a new Starlin project')
    .action((projectName) => {
        create(projectName);
    });

// Start dev server
program
    .command('dev')
    .description('Start development server')
    .action(() => {
        dev();
    });

program.parse();
