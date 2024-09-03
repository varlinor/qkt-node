import path from 'path'
import fs, { Dirent } from 'fs-extra'
import { loadJsonFile } from './file-helper'

/**
 * 加载包的packages 信息
 * @param baseDir
 * @returns
 */
export function loadPackages(baseDir: string, excludes: string[] | RegExp[]) {
  if (!baseDir) {
    throw new Error('baseDir is empty!')
  }
  if (!fs.existsSync(baseDir)) {
    throw new Error('baseDir is not exist!')
  }
  const alias: object[] = []
  const dirs = fs.readdirSync(baseDir, { withFileTypes: true })
  if (Array.isArray(dirs)) {
    const excludeFilter = (targetP: Dirent) => {
      const fN = targetP.name
      if (Array.isArray(excludes)) {
        for (let i = 0; i < excludes.length; i++) {
          const exclude = excludes[i]
          if (typeof exclude === 'string' && fN === exclude) {
            return false
          } else if (exclude instanceof RegExp && exclude.test(fN)) {
            return false
          }
        }
      }
      return true
    }

    dirs.forEach((dir: Dirent) => {
      if (dir.isDirectory()) {
        const pkgRoot = path.join(baseDir, dir.name)
        const pkgPath = path.join(pkgRoot, 'package.json')
        if (fs.existsSync(pkgPath) && excludeFilter(dir)) {
          // 读取文件中的name属性
          const pkgJson = loadJsonFile(pkgPath)
          if (pkgJson.name) {
            alias.push({ packageName: pkgJson.name, packagePath: pkgRoot })
          }
        }
      }
    })
  }
  return alias
}

/**
 * 根据package.json中的dependencies 和 devDependencies获取 所有的package的id
 * @param {*} dependencies
 * @returns
 */
export function getAllDependencies(dependencies: Record<string, string>): string[] {
  const deps = []
  if (dependencies && Object.keys(dependencies).length) {
    for (let dep in dependencies) {
      deps.push(dep)
    }
  }
  return deps
}
