import { createFilter } from '@rollup/pluginutils'
import { normalizePath } from '../modules/path-helper'

const isTargetImporter = (p: string): string => {
  const buildCachePath = '@varlinor/builder/utils/dynamic-import'.replace(/\//g, '_')
  return (
    (p.includes('varlinor/builder') && p.includes('/utils/dynamic-import')) ||
    p.includes(buildCachePath)
  )
}
/**
 * 该插件无法生效，存在问题
 * @param param0
 * @returns
 */
export function dynamicImport({ include, exclude, componentsMap, presetModules } = {}) {
  const filter = createFilter(include, exclude)
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
