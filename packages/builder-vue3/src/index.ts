import fs from 'fs-extra'
import path from 'path'
import {
  scanFilesByConditions,
  getAllDependencies,
  loadJsonFile,
  normalizePath,
  FileFilter
} from '@varlinor/node-tools'
import { build as buildJs } from 'unbuild'
import { build as buildVue, defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import postcssPresetEnv from 'postcss-preset-env'
import cssInject from 'vite-plugin-css-injected-by-js'
import { merge, uniq } from 'lodash-es'

declare interface SfcBuildOptions {
  input: string
  name: string
  externals: any[]
  output: { [key: string]: any }
}
interface PackEntry {
  name: string
  input: string
}
declare interface PackOption {
  externals?: string[] | RegExp[]
  entries?: PackEntry[]
  alias?: Record<string, any>
  replace?: Record<string, string>
  clean?: boolean
}
declare interface ScriptBuildOptions {
  entries: PackEntry[]
  externals: string[] | RegExp[]
  clean?: boolean
  rollup?: {
    emitCJS: boolean
    output: Record<string, any>
  }
  replace?: Record<string, any>
  alias?: Record<string, any>
}

/**
 * 获取sfc打包配置
 * @param opts
 * @returns
 */
export function getSfcBuildConfig(opts: SfcBuildOptions) {
  const { input, name, externals, output } = opts
  if (!input || !name) return null
  return defineConfig({
    configFile: false,
    plugins: [vue(), cssInject()],
    css: {
      preprocessorOptions: { css: { charset: false } },
      postcss: {
        plugins: [postcssPresetEnv()]
      }
    },
    build: {
      minify: false,
      cssMinify: true,
      emptyOutDir: false,
      lib: {
        name: name,
        formats: ['es'],
        entry: input,
        filename: `${name}.js`
      },
      rollupOptions: {
        external: Array.isArray(externals) && externals.length ? [...externals] : [],
        output
      }
    }
  })
}

/**
 * 获取脚本打包的配置
 * @param opts
 * @returns
 */
export function getScriptBuildConfig(opts: ScriptBuildOptions) {
  if (!opts.entries || !opts.externals) {
    throw new Error('entries or externals is empty, please check!')
  }
  const { entries, externals, clean, rollup, alias, replace } = opts
  const buildOpt = merge(
    {
      failOnWarn: false,
      clean: true,
      declaration: false,
      rollup: {
        emitCJS: false,
        output: {
          format: 'es', // 设置输出格式为 ES 模块
          entryFileNames: '[name].js' // 设置输出文件名为 .js 后缀
        }
      }
    },
    {
      entries,
      externals,
      clean,
      rollup,
      alias: alias || {},
      replace: replace || {}
    }
  )
  return buildOpt
}

/**
 * 打包所有脚本文件
 * @param packageRoot
 * @param packOption
 */
export async function buildScripts(packageRoot: string, packOption: PackOption) {
  // must be a package root path
  const rootDir = normalizePath(path.resolve(process.cwd(), packageRoot || '.'))
  const externals = checkAndLoadExternals(rootDir, packOption.externals)

  const jsBuildOpt = getScriptBuildConfig({
    entries: packOption.entries, // 所有的sfc的包含install的文件位置
    clean: packOption.clean,
    externals: externals,
    replace: packOption.replace || {},
    alias: packOption.alias || {}
  })

  console.log('Ready to build script files ...')
  await buildJs(null, false, jsBuildOpt)
  console.log('Build script files successfully!')
}

/**
 * 打包整个组件包
 * @param packageRoot
 * @param packOption
 */
export async function buildPackage(packageRoot: string, packOption: PackOption) {
  // must be a package root path
  const rootDir = normalizePath(path.resolve(process.cwd(), packageRoot || '.'))
  const ComponentsInfo = checkAndLoadComDefs(rootDir)
  // 获取externals
  const allExternals = checkAndLoadExternals(rootDir, packOption.externals)

  const BaseDir = `${rootDir}/src`
  const DistDir = `${rootDir}/dist`

  // 准备sfc的打包配置
  const buildPromise = []
  ComponentsInfo.forEach((com) => {
    const { packageName, basedir, filename, outputPath, outputFileName } = com
    // 截取掉/src，方便获得输出后的相对路径
    const outDir = outputPath.substring('/src'.length, outputPath.length - 1)
    // 判定入口文件，文件名规则和入口文件生成一致
    const entryFileName = outputFileName === 'index' ? 'index' : `index-${outputFileName}`
    // 将入口文件作为打包入口（提供了name的生成）
    const entry = path.join('./', outputPath, entryFileName)
    const outputBase = `${DistDir}/${outDir}`
    // 这里的name是实际输出的路径。
    const comOutPath = `${outDir}/${outputFileName}`
    console.log('build:', comOutPath)
    const buildOpt = getSfcBuildConfig({
      input: entry,
      output: {
        dir: outputBase,
        entryFileNames: `${outputFileName}.js`
      },
      name: comOutPath,
      externals: allExternals
    })
    if (buildOpt) {
      buildPromise.push(buildVue(buildOpt))
    }
  })
  console.log('Ready to build Vue SFC ...')
  await Promise.all(buildPromise)
  console.log('Build Vue SFC files successfully!')

  if (packOption.entries) {
    const entries = []
    entries.push(...packOption.entries)

    await buildScripts(packageRoot, {
      entries,
      externals: allExternals,
      clean: false
    } as PackOption)
  }
}

/**
 * 获取所有i18n文件，目录结构如下
 * 需要排除node_modules下的目录
 * baseDir/
 *       moduleA/i18n/zh-cn.ts
 *              /i18n/en.ts
 *              index.ts
 *       moduleB/i18n/zh-cn.ts
 *              /i18n/en.ts
 *              index.ts
 * @param packageRoot
 * @returns
 */
export function getI18nFiles(packageRoot: string) {
  function filterFunc(f, filePath, parentPath) {
    return parentPath.indexOf('node_modules') < 0 && parentPath.endsWith('i18n')
  }
  return getScriptFiles(packageRoot, filterFunc)
}

/**
 * 获取指定包下的全部script文件(ts后缀)
 * @param packageRoot
 * @param packOpt
 * @returns
 */
export function getScriptFiles(packageRoot: string, entryFilter?: FileFilter) {
  function modifier(file, filePath, parentPath) {
    let name = path.basename(filePath, '.ts')
    let parentP = normalizePath(parentPath)
    if (!parentP.endsWith('/')) {
      parentP += '/'
    }
    const srcIndex = parentP.indexOf('src/')
    let pPath = parentP
    if (srcIndex !== -1) {
      pPath = parentP.slice(srcIndex + 'src/'.length)
    }
    if (pPath.indexOf('./') === 0) {
      pPath = pPath.substring(2)
    }
    name = pPath ? `${pPath}${name}` : name
    return {
      name,
      input: normalizePath(filePath)
    }
  }

  function filterFunc(f, filePath, parentPath) {
    if (entryFilter != null && typeof entryFilter == 'function') {
      return filePath.endsWith('.ts') && entryFilter(f, filePath, parentPath)
    } else {
      return filePath.endsWith('.ts')
    }
  }

  return scanFilesByConditions(packageRoot, modifier, filterFunc)
}

function checkAndLoadComDefs(rootDir) {
  const comDefPath = path.join(rootDir, './components.json')
  if (!fs.existsSync(comDefPath)) {
    throw new Error(`Cannot find components.json in dir [${rootDir}]`)
  }
  return loadJsonFile(comDefPath)
}

function checkAndLoadExternals(rootDir, extraExternals?: (string | RegExp)[]) {
  const pkgPath = path.join(rootDir, './package.json')
  if (!fs.existsSync(pkgPath)) {
    throw new Error(`Cannot find package.json in dir [${rootDir}]`)
  }
  const { dependencies, devDependencies } = loadJsonFile(pkgPath)
  // 获取externals
  const externals = getAllDependencies(dependencies)
  const devExternals = getAllDependencies(devDependencies)
  let allExternals = [...externals, ...devExternals]
  if (extraExternals) {
    allExternals = uniq([...allExternals, ...extraExternals])
  }
  return allExternals
}
