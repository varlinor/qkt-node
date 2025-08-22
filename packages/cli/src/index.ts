import { program } from 'commander'
import path from 'path'
import fs from 'fs-extra'
import chalk from 'chalk'
import shell from 'shelljs'
import { upperFirst, lowerCase } from 'lodash-es'
import { normalizePath } from '@varlinor/node-tools'
import { cleanNodeModules } from './modules/clean'
import { deleteTags } from './modules/git'
import { processPackageInfos } from './modules/version'
import { generateSfcDefineAndEntryFiles } from './modules/gen-sfc-defs'

import { version } from '../package.json'

program.name('qkt-cli').version(version)

// 删除node_modules
program
  .command('clean')
  .description('used to clean something in target directory ')
  .option(
    '-c, --current-path',
    "use current path to generate, if set this parameter, '-m' and '-b' can set empty, if not, '-m' and '-b' must be valued"
  )
  .option('-b, --base-dir', 'target directory which has moduleName to scan')
  .option(
    '-m, --module-name <moduleName>',
    "generate entry file for packages' components, based on components.json"
  )
  .action(async (cmdObj) => {
    let { currentPath, moduleName, baseDir } = cmdObj
    if (currentPath) {
      // console.log('local mode')
      const curPath = process.cwd()
      moduleName = path.basename(curPath)
      baseDir = normalizePath(path.dirname(curPath))
    } else {
      if (!moduleName || !baseDir) throw new Error('illegal parameters, please check!')
    }
    // console.log('baseDir:%s, moduleName:%s', baseDir, moduleName)
    cleanNodeModules(baseDir, moduleName)
  })

/**
 * 版本信息修改
 */
program
  .command('semver')
  .description('used to create package version, must be runned in project root directory ')
  .option(
    '-c, --create <createType>',
    'used to create a version for project, major | minor | patch can be specificed! '
  )
  .option('-i, --info', 'used to print current version info')
  .option('-r, --remote', 'used to print remote version info')
  .option(
    '-s, --snapshot <snapshotType>',
    'snapshot type can be specificed for different branch, just like:`moduleA@0.0.1-datacore-snapshot.0`'
  )
  .option('-o, --output', 'replace versions to templates/package.json')
  .action(async (cmdObj) => {
    let { create, info, remote, snapshot, output } = cmdObj
    const baseDir = process.cwd()
    const opts = {
      create,
      info,
      remote,
      snapshot,
      output
    }
    console.log('prepare process version info of packages:', JSON.stringify(opts))
    processPackageInfos(baseDir, opts)
  })

/**
 * delete tags in some project root directory
 */
program
  .command('tag')
  .description('used to remove useless tags, must be runned in project root directory ')
  .option('-r, --remote', 'used to clear remote tags ')
  .option('-o, --remoteName <remoteName>', 'used to specify which remote will be remove tags ')
  .option('-f, --filterCode <filterCode>', 'used to filte tags which will be removed ')
  .action(async (cmdObj) => {
    let { remote, remoteName, filterCode } = cmdObj
    const baseDir = process.cwd()
    deleteTags(baseDir, filterCode, remote, remoteName)
  })

program
  .command('generate')
  .description('used to generate files for packages ')
  .command('define')
  .option('-t, --isTs', 'specify source is typescript ', false)
  .option('-e, --isOutputEntry', 'enable create entry file', true)
  .option('-p, --prefix <prefix>', 'set component name prefix', 'Qkt')
  .option('-f, --force', 'default is merge, when set true, will replace old define', false)

  .action(async (cmdObj) => {
    let { isTs, isOutputEntry, prefix, force } = cmdObj
    const baseDir = process.cwd()
    const mode = force ? 'replace' : 'merge'
    const prefixStr = upperFirst(lowerCase(prefix))
    generateSfcDefineAndEntryFiles(baseDir, isTs, isOutputEntry, prefixStr, mode)
  })

/* final parse */
program.parse(process.argv)
