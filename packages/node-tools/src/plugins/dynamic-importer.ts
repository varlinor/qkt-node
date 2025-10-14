// import { createFilter } from '@rollup/pluginutils'
import { normalizePath } from '../modules/path-helper'

export interface DynamicImportOptions {
  include?: any
  exclude?: any
  componentsMap?: Record<string, any>
  presetModules?: any[]
}

const isTargetImporter = (p: string): string => {
  const buildCachePath = '@varlinor/builder-vue3/utils/dynamic-import'.replace(/\//g, '_')
  return (
    (p.includes('varlinor/builder-vue3') && p.includes('/utils/dynamic-import')) ||
    p.includes(buildCachePath)
  )
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
    transform(code, id) {
      const p = normalizePath(id)
      if (isTargetImporter(p) && componentsMap && Object.keys(componentsMap).length) {
        // console.log('modify custom importer:', p)
        try {
          const maps = []
          for (const key in componentsMap) {
            if (Object.prototype.hasOwnProperty.call(componentsMap, key)) {
              maps.push(`case '${key}' :  return () => import('${key}');`)
            }
          }
          const modifierCode = `export default function(id){
            //console.warn('Dynamic load:',id)
            switch(id){
              ${maps.join('\n')}
              default:
                return Promise.reject(new Error('Unknow variable dynamic import: '+id));
            }
          }`
          return modifierCode
        } catch (error) {
          console.error(error)
          this.error(error)
          return code
        }
      }
      return null
    }
  }
}
