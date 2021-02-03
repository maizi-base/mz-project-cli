const { spawn } = require('child_process')
const chalk = require('chalk')
const fs = require('fs')

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
 * 删除文件
 * @param {String} filePath 需删除的文件地址
 */
function deleteFile(filePath) {
  try {
    // 判断文件或文件夹是否存在
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    } else {
      console.log('inexistence path：', filePath)
    }
  } catch (error) {
    console.error('del error', error)
  }
}

/**
 * Don't use allow func!
 */
function log() {
  const args = Array.prototype.slice.call(arguments)
  args[0] = chalk.blue(args[0])
  console.log.apply(console, args)
}

exports.log = log
exports.deleteFile = deleteFile