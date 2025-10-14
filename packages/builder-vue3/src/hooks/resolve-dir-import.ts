import { resolveDirImport } from '@varlinor/node-tools/plugins'
/**
 * 用于unbuild 的 rollup:options的hook
 * 在打包scripts时，添加resolve dir import 插件使用。
 * 可以将scripts中的 目录应用补全。以防二次引用时路径解析错误。
 * @param packageRoot
 * @param scopes
 * @returns
 */
export function rewriteDirImportPath(packageRoot: string, scopes: string[]): function {
  return (ctx, opts) => {
    // console.log('current opts:', opts)
    const { plugins } = opts
    if (Array.isArray(plugins)) {
      const plugin = resolveDirImport({
        basePath: packageRoot,
        scopes
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
