#!/usr/bin/env node

const inquirer = require('inquirer');
const clear = require('clear')
const chalk = require('chalk');
const config = require('../config.json')
const { getBlpTypes, start } = require('./main')

class Command {

  step() {
    // 询问式交互
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
        // TODO add simple
        if (answers.type === 'simple') {
          return console.log(chalk.red('A joke😄'));
        }
        start(answers)
      });
  }

  run() {
    // 清空控制台
    clear()
    // 交互程序
    this.step()
  }
}

exports.Command = Command


// function downloadTarball(pkgName) {
//   getPackageInfo(pkgName)
// }
