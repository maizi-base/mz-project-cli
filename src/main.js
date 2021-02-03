const fs = require('fs')
const config = require('../config.json')
const path = require('path')
const chalk = require('chalk')
const os = require('os')
const copy = require('copy')
const { gitClone, log } = require('../lib/utils')

// 自有项目名称
let projectName = ''
// 文件缓存地址
const tmpDir = getTmpDir()
// 最终项目保存地址
let finalDir = ''

async function start(projName, desc, blpType) {
  _setProjectName(projName)
  _setFinalDir(projName)
  const tmpFileDir = path.join(tmpDir, projName)
  await cloneProject(blpType, tmpFileDir)
  copyAndReplacePackage(projName, desc, blpType)
  copyProject()
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
 * @param {*} projName 自建项目名
 * @param {*} blpType 模板文件名
 */
function copyAndReplacePackage(projName, desc, blpType) {
  console.log('copy project...');
  const blpName = config.boilerplate[blpType].blpName
  // const pkgInfo = require('../egg-boilerplate-admin/boilerplate/_package.json')
  const tmpBlpDir = path.join(tmpDir, `${projName}/boilerplate`)
  const pkgFile = fs.readFileSync(path.join(tmpBlpDir, '_package.json'), 'utf8')
  const pkgFileAfter = replaceTmp(pkgFile, projName, desc)
  fs.writeFile(path.join(tmpBlpDir, 'package.json'), pkgFileAfter, 'utf8', err => {
    if (err) throw err
  })
}

function copyProject() {
  // 模板文件需要有boilerplate文件夹
  const tmpFileDir = path.join(tmpDir, projName, 'boilerplate')
  copy(tmpFileDir + '/**/*', finalDir, (err, file) => {
    if (err) throw err
    log('file copyed!')
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
 * @param {*} str 
 * @param {*} projName 
 * @param {*} desc 
 */
function replaceTmp(str, projName, desc) {
  return str
    .replace(/\{\{name\}\}/g, projName)
    .replace(/\{\{description\}\}/g, desc)
}

/**
 * 文件缓存地址
 */
function getTmpDir() {
  return path.join(os.tmpdir(), 'mz-project-cli');
}

// 导出函数
exports.cloneProject = cloneProject
exports.copyAndReplacePackage = copyAndReplacePackage
exports.getBlpTypes = getBlpTypes
exports.start = start
