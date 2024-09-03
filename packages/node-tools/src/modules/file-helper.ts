import path from 'path'
import fs, { Dirent } from 'fs-extra'
import { normalizePath } from './path-helper'

export type Modifier = (item: Dirent, filePath?: string, parentPath?: string) => any

export type FileFilter = (f: Dirent, filePath?: string, parentPath?: string) => Boolean

export function scanFilesByConditions(
  dirPath: string,
  modifier: Modifier,
  filter?: FileFilter
): Array<any> {
  const fileList: Array<any> = []
  const files: Array<Dirent> = fs.readdirSync(dirPath, { withFileTypes: true })
  files.forEach((file: Dirent) => {
    const filePath: string = path.join(dirPath, file.name)
    if (file.isDirectory()) {
      fileList.push(...scanFilesByConditions(filePath, modifier, filter)) // 递归调用并展开结果数组
    } else if (file.isFile()) {
      const shouldInclude = !filter || filter(file, filePath, dirPath)
      if (shouldInclude) {
        const modifiedObj =
          typeof modifier === 'function' ? modifier(file, filePath, dirPath) : filePath
        fileList.push(modifiedObj)
      }
    }
  })
  return fileList
}

export function scanFiles(dirPath: string, modifier: Modifier): Array<any> {
  return scanFilesByConditions(dirPath, modifier)
}

export function scanFilesByFilter(dirPath: string, filter: FileFilter): Array<any> {
  const modifier: Modifier = (f, fp, p) => {
    return fp
  }
  return scanFilesByConditions(dirPath, modifier, filter)
}

/**
 * 扫描指定包对应的组件定义，并返回
 * @param packages
 * @returns
 */
export function scanAllComponents(packages: string[]) {
  const comPaths = {}
  if (Array.isArray(packages) && packages.length) {
    packages.forEach((pkg) => {
      if (pkg === '/@/') {
        // 处理以 /@/ 开头的路径
        const srcPath = path.resolve('src')
        const filter = (f, filePath, parentPath) => {
          return filePath.endsWith('.vue')
        }
        const allVues = scanFilesByFilter(srcPath, filter)

        if (Array.isArray(allVues)) {
          allVues.forEach((f) => {
            const d = normalizePath(f).split('/src/')[1]
            const key = `/@/${d}`
            comPaths[key] = key
          })
        }
        return // 跳过后续处理
      }
      const packagePath = path.resolve('node_modules', pkg)
      if (fs.existsSync(packagePath)) {
        const componentsPath = path.join(packagePath, 'components.json')
        if (fs.existsSync(componentsPath)) {
          const componentsJson = JSON.parse(fs.readFileSync(componentsPath, 'utf8'))
          componentsJson.forEach((component) => {
            const { basedir, importPath, outputFileName } = component
            let comPath
            const dir = basedir.split('/src/')[1]
            let impName
            if (fs.existsSync(path.join(packagePath, 'src'))) {
              comPath = path.join('./node_modules', pkg, 'src/', dir, importPath)
              impName = path.basename(importPath, '.vue')
            } else if (fs.existsSync(path.join(packagePath, 'dist'))) {
              if (outputFileName) {
                comPath = path.join('./node_modules', pkg, 'dist/', dir, outputFileName)
                impName = outputFileName
              } else {
                comPath = path.join('./node_modules', pkg, 'dist/', dir, importPath)
                impName = path.basename(importPath)
              }
            }
            if (comPath && impName) {
              let importer = `${pkg}/${dir}/${impName}`
              comPath = normalizePath(comPath)
              if (fs.existsSync(comPath)) {
                // console.log('scan>> ', comPath)
                comPaths[importer] = comPath
              }
            }
          })
        }
      } else {
        console.error(`${pkg} hasn't installed in this project!`)
      }
    })
  }
  return comPaths
}

/**
 * 加载json配置文件
 * @param filePath
 * @returns
 */
export function loadJsonFile(filePath: string): any {
  if (filePath) {
    const content = fs.readFileSync(filePath, 'utf-8')
    if (content) {
      try {
        return JSON.parse(content)
      } catch (err) {
        throw new err()
      }
    }
  }
  return null
}
