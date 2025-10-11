import path from 'node:path'
import fs from 'fs-extra'
import { parse } from 'acorn'
import { simple as walk } from 'acorn-walk'
import MagicString from 'magic-string'

export interface ResolveDirImportOptions {
  scopes?: string[]
  basePath: string
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

export function resolveDirImport(options?: ResolveDirImportOptions) {
  const { basePath, scopes, exts = ['.ts', '.js', '.vue', '.tsx', '.jsx'] } = options
  const [rootDir, curDir] = basePath.split('packages/')
  return {
    name: 'qkt-plugin:resolve-dir-import',
    enforce: 'pre',
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
       * 1、将指定scope的截断，注意保留原本的source
       * 2、将basePath 按照packages截断，找到多包的根目录
       * 3、拼接rootDir 和 packages后的目录名加src，判断文件
       * 4、如果需要拼接index，则在原本的source上添加/index
       */
      const checkAndRewrite = (source: string, start: number, end: number) => {
        if (!scopes?.some((s) => source.startsWith(s))) return
        // console.log('target source:', source)
        // 去掉 scope 前缀，定位到本地目录
        for (let i = 0; i < scopes.length; i++) {
          const s = scopes[i]
          if (source.startsWith(s)) {
            const subPath = source.replace(s, '').replace(curDir, `${curDir}/src`)
            const targetBase = path.resolve(rootDir, 'packages/', subPath)
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
