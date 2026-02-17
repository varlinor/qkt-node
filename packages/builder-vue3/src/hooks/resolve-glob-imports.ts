import { resolveGlobImports } from '@varlinor/node-tools/plugins'

export function createGlobResolveHook(packageRoot: string): Function {
  return (ctx, opts) => {
    // console.log('current opts:', opts)
    const { plugins } = opts
    if (Array.isArray(plugins)) {
      const plugin = resolveGlobImports({
        basePath: packageRoot
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
