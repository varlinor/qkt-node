// import { createFilter } from '@rollup/pluginutils'
import { normalizePath } from '../modules/path-helper'

export interface DynamicImportOptions {
  include?: any
  exclude?: any
  componentsMap?: Record<string, any>
  presetModules?: any[]
}

// 运行时，builder-vue3中的utils已经被编译，因此需要动态匹配方法段，并替换，这里是定义需要替换的方法。
const Reg_replacement = /function\s+dynamicImport\s*\(\s*id\s*\)\s+\{[\s\S]*?\}/

// 开发时
const isTargetImporterForDev = (p: string): boolean => {
  const buildCachePath = '@varlinor/builder-vue3/utils/dynamic-import'.replace(/\//g, '_')
  return (
    (p.includes('varlinor/builder-vue3') && p.includes('/utils/dynamic-import')) ||
    p.includes(buildCachePath)
  )
}

// 二开工程时
const isTargetImporterForRuntime = (code: string): boolean => {
  // 内容中包含这个引用
  return code.includes('varlinor/builder-vue3') && code.includes('/utils/dynamic-import')
}

/**
 * 该插件暂时无法处理带参数的路径映射
 * 后续将switch中的判定增加去除路径上的参数，再进行判定
 * @param param0
 * @returns
 */
export function dynamicImport(options: DynamicImportOptions = {}) {
  const { /* include, exclude, */ componentsMap, presetModules } = options
  // const filter = createFilter(include, exclude)
  return {
    name: 'qkt-plugin:dynamic-import',
    enforce: 'pre',
    transform(code: string, id: string) {
      const p = normalizePath(id)
      const isDevTarget = isTargetImporterForDev(p)
      const isRuntimeTarget = !isDevTarget && isTargetImporterForRuntime(code)
      const hasMaps = componentsMap && Object.keys(componentsMap).length > 0
      if ((isDevTarget || isRuntimeTarget) && hasMaps) {
        // console.log('modify custom importer:', p)
        try {
          const maps = []
          if (hasMaps) {
            for (const key in componentsMap) {
              if (Object.prototype.hasOwnProperty.call(componentsMap, key)) {
                maps.push(`case '${key}' :  return () => import('${key}');`)
              }
            }
          }

          const modifierCode = `//console.warn('Dynamic load:',id)
            switch(id){
              ${maps.join('\n')}
              default:
                return Promise.reject(new Error('Unknow variable dynamic import: '+id));
            }`

          if (isDevTarget) {
            // 开发模式：直接用生成代码整体替换模块内容
            return `export default function(id){
              ${modifierCode}
            }`
          }
          if (isRuntimeTarget && Reg_replacement.test(code)) {
            // 运行时：对已打包的代码做字符串替换
            const newCode = code.replace(Reg_replacement, `function dynamicImport(id) {
              ${modifierCode}
            }`)
            if (newCode !== code) return newCode
          }
          return null
        } catch (error) {
          console.error(error)
          // @ts-ignore
          this.error(error)
          return code
        }
      }
      return null
    }
  }
}
