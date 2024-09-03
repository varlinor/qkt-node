import path from 'path'
import fs, { Dirent } from 'fs-extra'
import { isEqual, cloneDeep } from 'lodash-es'

/**
 * 格式为： "/@/*": [ "src/*" ],
 * @param baseConfigPath
 * @param pathAlias
 */
export function mergeBaseTsConfigAlias(
  baseRoot: string,
  baseConfigPath: string,
  pathAlias: object
) {
  if (!baseConfigPath || !fs.existsSync(baseConfigPath)) {
    throw new Error('baseConfigPath is empty or not exist!')
  }
  const contentStr = fs.readFileSync(baseConfigPath, 'utf8')
  if (!contentStr) {
    throw new Error('Unable to read the base tsconfig file!')
  }

  try {
    const baseConfig = JSON.parse(contentStr)
    const newContent = cloneDeep(baseConfig)

    const tsPaths =
      newContent.compilerOptions && newContent.compilerOptions.paths
        ? cloneDeep(newContent.compilerOptions.paths)
        : {}

    let pathsUpdated = false
    for (const [alias, targetPath] of Object.entries(pathAlias)) {
      const formattedAlias = `${alias}/*`
      const formattedPath = `${targetPath.replace(/\\/g, '/')}/*`

      if (!tsPaths[formattedAlias] || !isEqual(tsPaths[formattedAlias], [formattedPath])) {
        tsPaths[formattedAlias] = [formattedPath]
        pathsUpdated = true
      }
    }

    if (pathsUpdated) {
      console.log('Updating tsconfig.json with new paths.')
      newContent.compilerOptions = newContent.compilerOptions || {}
      newContent.compilerOptions.paths = tsPaths
      fs.writeFileSync(baseConfigPath, JSON.stringify(newContent, null, 2))
    } else {
      console.log('No changes to tsconfig.json paths required.')
    }
  } catch (error) {
    throw new Error(`Error parsing or updating tsconfig: ${error.message}`)
  }
}
