import { scanFilesByConditions } from './file-helper' // 扫描目录
import { normalizePath } from './path-helper'
import checkbox from '@inquirer/checkbox'
import path from 'path'

declare interface SelectOptions {
  basePath: string
  modifier: Function
  filter: Function
  tipInfo: string
}

export function selectFiles(options: SelectOptions) {
  const { basePath, modifier, filter, tipInfo } = options
  if (!basePath) {
    throw new Error('basePath is empty')
  }

  let localModifier = modifier
    ? modifier
    : (file, filePath, parentPath) => {
        file, filePath, parentPath
      }

  let localFilter = filter ? filter : (file, filePath, parentPath) => true

  const choiseList = scanFilesByConditions(basePath, localModifier, localFilter)

  const question = {
    message: tipInfo || 'please choose your needed file!',
    pageSize: 15,
    choices: choiseList
  }

  return new Promise(async (resolve, reject) => {
    try {
      const selected = await checkbox(question)
      resolve(selected)
    } catch (error) {
      reject(error)
    }
  })
}

export function selectSfc(basePath, isTS = false) {
  const scanPath = normalizePath(path.join(basePath, 'src'))
  const modifier = (file, filePath, parentPath) => {
    const fp = normalizePath(filePath)
    const name = fp.replace(scanPath, '')
    return { name, value: fp }
  }

  const filter = (file, filePath, parentPath) => {
    // 所有vue文件，以及文件名是index.js的
    if (
      '.vue' === path.extname(filePath) ||
      (isTS ? 'index.ts' === path.basename(filePath) : 'index.js' === path.basename(filePath))
    ) {
      return true
    }
    return false
  }

  return selectFiles({
    basePath: scanPath,
    tipInfo: '请选择需要单独打包的组件（即需要生成install入口文件的组件）:',
    modifier,
    filter
  })
}
