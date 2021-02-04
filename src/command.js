#!/usr/bin/env node

const inquirer = require('inquirer')
const clear = require('clear')
const chalk = require('chalk')
const { getBlpTypes, start } = require('./main')
const { program } = require('commander')

class Command {

  init() {
    program.version('0.1.1');
    program.option('-h, --help', 'output usage information')
    program
      .command('create <project-name>')
      .description('create a new project powered by mz-project-cli')
      .action((name) => {
        clear();
        this.ask(name)
      });

    program.parse(process.argv);

    if (!program.args.length) {
      program.help();
    }
  }

  /**
   * 询问式交互
   * @param {String} projName? 项目名称
   */
  ask(projName) {
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'type',
          message: 'Please select a boilrplate type',
          choices: [
            ...getBlpTypes(),
            new inquirer.Separator(),
          ],
        },
        {
          type: 'input',
          name: 'projName',
          message: "Please input your project name:",
          default: projName
        },
        {
          type: 'input',
          name: 'description',
          message: "Please input you project description:",
        },
        {
          type: 'input',
          name: 'author',
          message: "Please input the author:",
        },
      ])
      .then((answers) => {
        start(answers)
      })
  }

  run() {
    // init
    this.init()
  }
}

exports.Command = Command


// function downloadTarball(pkgName) {
//   getPackageInfo(pkgName)
// }
