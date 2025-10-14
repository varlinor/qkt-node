import path from 'node:path'
import fs, { Dirent } from 'fs-extra'
import { parse } from 'acorn'
import { simple as walk } from 'acorn-walk'
import MagicString from 'magic-string'
import { loadJsonFile } from '../modules/file-helper'

export interface ResolveDirImportOptions {
  basePath: string
  subPackageBase: string
  scopes?: string[]
  exts?: string[]
}

function resolveDirIndex(basePath: string): string | null {
  if (!fs.existsSync(basePath)) {
    return null
  }
  const stat = fs.statSync(basePath)
  if (!stat.isDirectory()) {
    return null
  }
  // index 文件优先级
  const candidates = ['index.ts', 'index.js', 'index.vue']
  for (const file of candidates) {
    const full = path.join(basePath, file)
    if (fs.existsSync(full)) {
      return path.join(basePath, 'index') // 不带后缀
    }
  }
  return null
}

/**
 * 根据指定的子包根目录，扫描出所有子包及路径的映射关系
 * @param parentPath
 */
function scanPackages(parentPath?: string): Record<string, any> {
  const files: Array<Dirent> = fs.readdirSync(parentPath, { withFileTypes: true })
  const pkgMap: Record<string, any> = {}
  if (files.length) {
    files.forEach((file: Dirent) => {
      const filePath: string = path.join(parentPath, file.name)
      if (file.isDirectory()) {
        const pkgPath = path.join(filePath, 'package.json')
        if (fs.existsSync(pkgPath)) {
          const pkgObj = loadJsonFile(pkgPath)
          if (!pkgObj) {
            console.error('Cannot find package.json, please check your configuration!')
          }
          pkgMap[pkgObj.name] = {
            name: pkgObj.name,
            dirName: file.name,
            pkgPath: pkgPath,
            pkgRoot: filePath
          }
        }
      }
    })
  }
  return pkgMap
}

export function resolveDirImport(options?: ResolveDirImportOptions) {
  const {
    basePath,
    scopes,
    exts = ['.ts', '.js', '.vue', '.tsx', '.jsx'],
    subPackageBase = 'packages/'
  } = options
  const [rootDir, curDir] = basePath.split(subPackageBase)

  // 扫描packages目录，保存目录和包名的map
  const subPackageInfos = scanPackages(path.join(rootDir, subPackageBase))
  // console.log('current sub package infos:', subPackageInfos)

  return {
    name: 'qkt-plugin:resolve-dir-import',
    apply: 'build',
    async transform(code, id) {
      // 只处理 TS/JS/Vue 源码，不处理 node_modules
      if (id.includes('node_modules')) return null
      if (!/\.(ts|js|vue)$/.test(id)) return null

      const ast = parse(code, {
        ecmaVersion: 'latest',
        sourceType: 'module'
      })

      const ms = new MagicString(code)
      let modified = false

      /**
       * source 是 实际引用的uri
       * 处理逻辑：
       * 1、将指定 scope 的截断，注意保留原本的source
       * 2、将 basePath 按照 packages 截断，找到多包的根目录
       * 3、扫描 packages 根目录，获取所有包的src和目录名对应关系
       * 4、拼接 rootDir 和 packages 后的目录名加src，判断文件
       * 5、如果需要拼接index，则在原本的source上添加/index
       */
      const checkAndRewrite = (source: string, start: number, end: number) => {
        if (!scopes?.some((s) => source.startsWith(s))) return
        // console.log('target source:', source)
        // 基于subPackageInfos，定位到本地目录
        for (let key in subPackageInfos) {
          const item = subPackageInfos[key]
          if (source.includes(item.name)) {
            const subPath = source.replace(item.name, '')
            const targetBase = path.join(item.pkgRoot, 'src', subPath)
            const newPath = resolveDirIndex(targetBase)
            if (newPath) {
              // 有返回值也就是需要添加index
              // 转成相对路径（保持 import 语义）
              const rewritePath = source.endsWith('/') ? `${source}index` : `${source}/index`
              console.log('rewrite module:', rewritePath)
              // 替换 import 语句里的路径
              ms.overwrite(start, end, JSON.stringify(rewritePath))
              modified = true
              break
            }
          }
        }
      }

      walk(ast, {
        ImportDeclaration(node: any) {
          checkAndRewrite(node.source.value, node.source.start, node.source.end)
        }
        /* ExportNamedDeclaration(node: any) {
          if (node.source) {
            checkAndRewrite(node.source.value, node.source.start, node.source.end)
          }
        },
        ExportAllDeclaration(node: any) {
          if (node.source) {
            checkAndRewrite(node.source.value, node.source.start, node.source.end)
          }
        } */
      })

      if (!modified) return null
      return {
        code: ms.toString(),
        map: ms.generateMap({ hires: true })
      }
    }
  }
}
