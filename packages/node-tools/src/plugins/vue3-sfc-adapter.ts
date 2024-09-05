import { cloneDeep } from 'lodash-es'
import { normalizePath } from '../modules/path-helper'
const extensions = ['.ts', '.js', '.jsx', '.tsx', '.css', '.scss', '.vue']

const tryResolveFile = async (basePath, extensions, context, importer, options) => {
  for (const ext of extensions) {
    const resolved = await context.resolve(`${basePath}${ext}`, importer, options)
    if (resolved) return resolved.id
  }
  return null
}

const tryDistResolve = async (distPath, context, importer, options) => {
  return tryResolveFile(distPath, ['.js', '/index.js'], context, importer, options)
}

const trySrcResolve = async (srcPath, context, importer, options) => {
  if (!srcPath.includes('src/')) return null
  return tryResolveFile(
    srcPath,
    ['.vue', '/index.vue', '/index.js', '/index.ts'],
    context,
    importer,
    options
  )
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
    /*
      可能遇到的情况：
      1、加载已经安装的指定scopes里的第三方包做处理，此时source为@scope开头
      2、加载本地packages里某个包的组件，因为在vite.config中配置了alias，所以会将@scope/packageName转换成本地路径，
        此时source变成了/yourPackagePath/packages/components/这种格式
      PS：经过验证，本地包不添加alias时，无法通过@开头的处理逻辑进行解析，即使添加src也不行
      */
    async resolveId(source, importer, options) {
      const hasSuffix = extensions.some((e) => source.toLowerCase().endsWith(e))
      if (!hasSuffix) {
        const matched = curAlias.find((a) => source.indexOf(a.replacement) > -1)
        // console.log('matched:', matched)
        if (matched || scopes.some((sc) => source.includes(sc))) {
          // 仅在开发环境中应用
          try {
            const p = normalizePath(source)
            const pArr = p.split('/')
            let resolvedId = null
            if (matched) {
              resolvedId = await trySrcResolve(p, this, importer, options)
            } else if (p.startsWith('@') && pArr.length > 2) {
              // 处理私有包路径（@开头）
              resolvedId = await tryDistResolve(p, this, importer, options)
            } else if (pArr.length > 1) {
              // 处理普通路径
              resolvedId = await tryDistResolve(p, this, importer, options)
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
