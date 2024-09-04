import { cloneDeep } from 'lodash-es'
import { normalizePath } from '../modules/path-helper'
const extensions = ['.ts', '.js', '.jsx', '.tsx', '.css', '.scss', '.vue']

const tryResolve = async (packageName, otherParts, context, importer, options) => {
  const srcPath = `${packageName}/src/${otherParts}`
  const distPath = `${packageName}/dist/${otherParts}`

  // 尝试解析 .vue 文件
  let resolved = await context.resolve(`${srcPath}.vue`, importer, options)
  if (resolved) return resolved.id

  // 尝试解析 .js 文件
  resolved = await context.resolve(`${distPath}.js`, importer, options)
  if (resolved) return resolved.id

  // 尝试解析 index.js 文件
  resolved = await context.resolve(`${distPath}/index.js`, importer, options)
  if (resolved) return resolved.id

  return null // 无法解析
}

export function vue3SfcAdapter(scopes: string[]) {
  let curAlias = []
  return {
    name: 'rts-plugin:vue3-sfc-adapter',
    configResolved(config) {
      const {
        resolve: { alias }
      } = config
      curAlias = cloneDeep(alias)
      // console.log('current alias:', JSON.stringify(curAlias))
    },
    async resolveId(source, importer, options) {
      const hasSuffix = extensions.some((e) => source.toLowerCase().endsWith(e))
      if (!hasSuffix) {
        const matched = curAlias.some((a) => source.indexOf(a.replacement) > -1)
        // console.log('matched:', matched)
        if (matched || scopes.some((sc) => source.includes(sc))) {
          // 仅在开发环境中应用
          try {
            const p = normalizePath(source)
            const pArr = p.split('/')
            let resolvedId = null

            if (p.startsWith('@') && pArr.length > 2) {
              // 处理私有包路径（@开头）
              resolvedId = await tryResolve(
                `${pArr[0]}/${pArr[1]}`,
                pArr.slice(2).join('/'),
                this,
                importer,
                options
              )
            } else if (pArr.length > 1) {
              // 处理普通路径
              resolvedId = await tryResolve(
                pArr[0],
                pArr.slice(1).join('/'),
                this,
                importer,
                options
              )
            }

            if (resolvedId) return resolvedId

            // 如果无法匹配到，使用默认解析
            const resolved = await this.resolve(source, importer, { skipSelf: true })
            if (resolved) return resolved.id
          } catch (error) {
            console.error('Error resolving module:', source, error)
          }
        }
      }
      return null // 其他情况不处理
    }
  }
}
