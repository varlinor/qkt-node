import { resolveDirImport } from '@varlinor/node-tools/plugins'
/**
 * 用于unbuild 的 rollup:options的hook
 * 在打包scripts时，添加resolve dir import 插件使用。
 * 可以将scripts中的 目录应用补全。以防二次引用时路径解析错误。
 * @param packageRoot
 * @param scopes
 * @param exts
 * @param subPackageBase
 * @returns
 */
export function createRewriteHook(
  packageRoot: string,
  scopes: string[],
  exts?: string[],
  subPackageBase?: string = 'packages/'
): Function {
  return (ctx, opts) => {
    // console.log('current opts:', opts)
    const { plugins } = opts
    if (Array.isArray(plugins)) {
      const plugin = resolveDirImport({
        basePath: packageRoot,
        exts,
        scopes,
        subPackageBase
      })

      const idx = plugins.findIndex((p) => {
        return !!p && typeof p === 'object' && 'name' in p && p.name === 'unbuild-raw'
      })

      if (idx >= 0) {
        opts.plugins.splice(idx, 0, plugin)
      }
    }
  }
}

/**
 * 用于 vite 的 plugin
 * 在打包scripts时，添加resolve dir import 插件使用。
 * @param packageRoot
 * @param scopes
 * @param exts
 * @param subPackageBase
 * @returns
 */
export function createRewritePlugin(
  packageRoot: string,
  scopes: string[],
  exts?: string[],
  subPackageBase?: string = 'packages/'
): any {
  return resolveDirImport({
    basePath: packageRoot,
    exts,
    scopes,
    subPackageBase
  })
}
