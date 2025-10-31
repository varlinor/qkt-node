import fastGlob from 'fast-glob'

/**
 * 使用unbuild打包ts时，处理import.meta.glob的代码段
 * @returns
 */
export interface GlobResolveOptions {
  basePath?: string
}

const Def_GlobRegex =
  /const\s+(\w+)\s*=\s*import\.meta\.glob\(\s*(\[[\s\S]*?\]|['"][^'"]+['"])\s*(,\s*({[\s\S]*?}))?\s*\)/gs

export function resolveGlobImports(options: GlobResolveOptions = {}) {
  const { basePath } = options
  const baseDir = `${basePath}/src` // 基于src目录进行扫描
  return {
    name: 'qkt-plugin:resolve-glob-imports',
    apply: 'build',
    transform(code: string, id: string) {
      if (!id.includes('node_modules')) {
        let match
        let newCode = code

        // 重置正则表达式的lastIndex
        Def_GlobRegex.lastIndex = 0

        newCode = newCode.replace(Def_GlobRegex, (fullMatch, varName, pathsArg, _, optionsStr) => {
          const globs = pathsArg ? eval(`(${pathsArg})`) : []
          const globOptions = optionsStr ? eval(`(${optionsStr})`) : {}
          const files = fastGlob.sync(globs, {
            cwd: baseDir
          })
          console.log('scanned files:', files)
          let replacement = ' // ready for replace'
          if (globOptions.eager) {
            const impArr = [],
              mdlArr = []
            files.forEach((file, index) => {
              const fileStr = file.startsWith('./') ? file : `./${file}`
              impArr.push(`import __glob_${index} from '${fileStr}'`)
              mdlArr.push(`  '${fileStr}': __glob_${index}`)
            })
            replacement = `${impArr.join('\n')}\nconst ${varName} = {\n${mdlArr.join(',\n')}\n}\n`
          } else {
            const syncArr = []
            files.forEach((file, index) => {
              const fileStr = file.startsWith('./') ? file : `./${file}`
              syncArr.push(`  '${fileStr}': () => import('${fileStr}')`)
            })
            replacement = `const ${varName} = ${syncArr.join(',\n')};`
          }
          console.log('final replacement:', replacement)
          return replacement
        })
        return newCode
      }
    }
  }
}
