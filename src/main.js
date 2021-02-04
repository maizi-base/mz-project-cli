const fs = require('fs')
const os = require('os')
const config = require('mz-project-cli-config')
const path = require('path')
const chalk = require('chalk')
const copy = require('copy')
const { gitClone, log, deleteFile } = require('../lib/utils')

// 自有项目名称
let projectName = ''
// 文件缓存地址
const tmpDir = getTmpDir()
// 最终项目保存地址
let finalDir = ''

async function start(opts) {
  const { projName, type: blpType } = opts
  _setProjectName(projName)
  _setFinalDir(projName)
  const _pkgFilePath = path.join(finalDir, '_package.json')
  const tmpFileDir = path.join(tmpDir, projName)
  await cloneProject(blpType, tmpFileDir)
  copyAndReplacePackage(opts)
  copyProject(() => {
    deleteFile(_pkgFilePath)
  })
  setTimeout(showSuccess, 500)
}

/**
 * 根据模板名称克隆项目
 * @param {String} blpType 
 * @param {String} target 
 */
async function cloneProject(blpType, target) {
  try {
    console.log(chalk.yellow('开始下载项目...'));
    const repo = getProjectRepo(blpType)
    await gitClone(repo, target)
    console.log('===> clone done!');
  } catch (error) {
    console.log(chalk.red(error))
  }
}

/**
 * 替换_package.json 里的变量
 * @param {String} opts.projName 自建项目名
 * @param {String} opts.type 模板文件类型
 */
function copyAndReplacePackage(opts) {
  const { projName, type } = opts
  console.log('copy project...');
  const blpName = config.boilerplate[type].blpName
  // const pkgInfo = require('../egg-boilerplate-admin/boilerplate/_package.json')
  const tmpBlpDir = path.join(tmpDir, `${projName}/boilerplate`)
  const pkgFile = fs.readFileSync(path.join(tmpBlpDir, '_package.json'), 'utf8')
  const pkgFileAfter = replaceTmp(pkgFile, opts)
  fs.writeFileSync(path.join(tmpBlpDir, 'package.json'), pkgFileAfter, 'utf8')
}

/**
 * 拷贝项目
 * @param {Function} cb 成功回调
 */
function copyProject(cb) {
  // 模板文件需要有boilerplate文件夹
  const tmpFileDir = path.join(tmpDir, projectName, 'boilerplate')
  copy(tmpFileDir + '/**/*', finalDir, (err, file) => {
    if (err) throw err
    else {
      log('file copyed!')
      if (typeof cb === 'function') cb()
    }
  })
}

/**
 * 获取配置文件里的所有boilerplate key
 * @returns {Array} keys
 */
function getBlpTypes() {
  return Object.keys(config.boilerplate)
}

function showSuccess() {
  console.log(chalk.green('项目模板下载成功！'));
  console.log(chalk.green(
    '执行以下命令运行项目：\n' +
    `cd ${projectName} && npm install \n` +
    'npm run dev \n'
  ));
}

/**
 * copy tmp to target
 * @param {String} target target Dir
 */
function copyTmpToTarget(target) {
  copy(tmpdir, target, (err, file) => {
    console.log(err);
    console.log(file);
  })
}

function _setProjectName(projName) {
  projectName = projName
}

function _setFinalDir(projName) {
  finalDir = path.join(process.cwd(), projName)
}
/**
 * 根据模板名称获取项目仓库
 * @param {String} blpType 模板类型
 */
function getProjectRepo(blpType) {
  console.log(config.boilerplate[blpType]);
  return config.boilerplate[blpType].gitRepo
}

/**
 * 替换{{name}} => project-name
 * @param {String} str 原字符串/文件
 */
function _replaceTmpName(str, projName) {
  return str.replace(/\{\{name\}\}/g, projName)
}

/**
 * 替换{{description}} => project-description
 * @param {String} str 原字符串/文件
 */
function _replaceTmpDesc(str, desc) {
  return str.replace(/\{\{description\}\}/g, desc)
}

/**
 * 替换_package.json中的模板变量
 * @param {String} str 待替换字符、文件
 * @param {String} opts.projName 
 * @param {String} opts.desc 
 * @param {String} opts.author 
 */
function replaceTmp(str, opts) {
  const { projName, desc, author } = opts
  return str
    .replace(/\{\{name\}\}/g, projName)
    .replace(/\{\{description\}\}/g, desc)
    .replace(/\{\{author\}\}/g, author)
}

/**
 * 获取系统文件缓存地址
 */
function getTmpDir() {
  return path.join(os.tmpdir(), 'mz-project-cli');
}

// 导出函数
exports.cloneProject = cloneProject
exports.copyAndReplacePackage = copyAndReplacePackage
exports.getBlpTypes = getBlpTypes
exports.start = start
