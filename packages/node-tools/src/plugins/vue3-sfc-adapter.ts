
import { cloneDeep } from 'lodash-es'
const extensions = ['.ts', '.js', '.jsx', '.tsx', '.css', '.scss', '.vue']

export function vue3SfcAdapter(scope = '@qkt/') {
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
      // console.log('source:', source)
      const hasSuffix = extensions.some((e) => source.toLowerCase().endsWith(e))
      if (!hasSuffix) {
        const matched = curAlias.some((a) => source.indexOf(a.replacement) > -1)
        // console.log('matched:', matched)
        if (matched || source.startsWith(scope)) {
          // 仅在开发环境中应用
          try {
            // 尝试解析 .vue 文件
            const vueSource = `${source}.vue`
            // console.log('test source:', vueSource)
            const resolvedVue = await this.resolve(vueSource, importer, options)
            // console.log('vue resolved:', resolvedVue)
            if (resolvedVue) {
              return resolvedVue.id // 返回解析后的 .vue 文件路径
            }
            // 如果不是 .vue 文件，交由 Vite 自行处理
            const resolved = await this.resolve(source, importer, { skipSelf: true })
            // console.log('current resolved:', resolved)

            if (resolved) {
              return resolved.id // 返回解析后的路径
            }
          } catch (error) {
            console.error('Error resolving module:', source, error)
          }
        }
      }
      return null // 其他情况不处理
    }
  }
}
