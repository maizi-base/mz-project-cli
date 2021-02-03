const { spawn } = require('child_process');
const chalk = require('chalk');

/**
 * git clone命令
 * @param {String} repo 仓库地址
 * @param {String} target 保存目标路径
 */
exports.gitClone = (repo, target) => {
  let args = ['clone', repo]
  if (target) args.push(target)
  git = spawn('git', args)
  console.log(chalk.blue(`exec git ${args.join(' ')}`))

  git.stdout.on('data', (data) => {
    console.log(chalk.yellow('stdout', data))
  })
  git.stderr.on('data', (data) => {
    console.log(chalk.yellow(data))
  })
  return new Promise((resolve, reject) => {
    git.on('close', (code) => {
      if (code == 0) {
        resolve(code)
      }
      else {
        // console.log(chalk.red('err code', code))
        reject(Error('git clone err , errcode: ', code))
      }
    })
  })
}

/**
 * Don't use allow func!
 */
function log() {
  const args = Array.prototype.slice.call(arguments);
  args[0] = chalk.blue(args[0])
  console.log.apply(console, args);
}

exports.log = log