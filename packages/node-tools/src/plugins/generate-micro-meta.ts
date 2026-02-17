import path from 'path'
import fs from 'fs-extra'
import type { Plugin } from 'vite'
import { loadJsonFile } from '../modules/file-helper'
import { normalizePath } from '../modules/path-helper'

export interface GenerateMicroMetaOptions {
  /** 包根目录，默认从 Vite 配置推断 */
  packageRoot?: string
  /** 输出目录，默认使用 Vite 的 build.outDir */
  outputDir?: string
  /** 可选，健康检查 URL */
  healthCheckUrl?: string
  /** 是否包含依赖信息，默认 true */
  includeDependencies?: boolean
  /** 依赖过滤函数，用于过滤不需要的依赖 */
  dependencyFilter?: (depName: string) => boolean
}

interface MicroMeta {
  name: string
  version: string
  buildTime: string
  healthCheck?: string
  dependencies: Record<string, string>
}

/**
 * 格式化时间为 yyyy-MM-dd HH:mm:ss 格式
 */
function formatDateTime(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

/**
 * 生成微前端元信息
 */
function generateMetaData(
  packageJsonPath: string,
  options: GenerateMicroMetaOptions
): MicroMeta | null {
  const pkgJson = loadJsonFile(packageJsonPath)
  if (!pkgJson) {
    console.warn('[generate-micro-meta] Cannot find package.json')
    return null
  }

  const { name, version, dependencies = {}, devDependencies = {} } = pkgJson
  if (!name || !version) {
    console.warn('[generate-micro-meta] package.json missing name or version')
    return null
  }

  const meta: MicroMeta = {
    name,
    version,
    buildTime: formatDateTime(new Date()),
    dependencies: {}
  }

  // 添加健康检查 URL（如果提供）
  if (options.healthCheckUrl) {
    meta.healthCheck = options.healthCheckUrl
  }

  // 处理依赖信息
  if (options.includeDependencies !== false) {
    const allDeps = { ...dependencies, ...devDependencies }
    let filteredDeps: Record<string, string> = {}

    if (options.dependencyFilter) {
      // 使用过滤函数
      for (const [depName, depVersion] of Object.entries(allDeps)) {
        if (options.dependencyFilter(depName)) {
          filteredDeps[depName] = depVersion
        }
      }
    } else {
      filteredDeps = allDeps
    }

    meta.dependencies = filteredDeps
  }

  return meta
}

/**
 * 写入元信息文件
 */
function writeMetaFile(filePath: string, meta: MicroMeta): void {
  try {
    // 确保目录存在
    const dir = path.dirname(filePath)
    if (!fs.existsSync(dir)) {
      fs.mkdirpSync(dir)
    }
    // 写入文件
    fs.writeFileSync(filePath, JSON.stringify(meta, null, 2), 'utf-8')
    console.log(`[generate-micro-meta] Generated: ${normalizePath(filePath)}`)
  } catch (error) {
    console.error('[generate-micro-meta] Failed to write meta file:', error)
  }
}

/**
 * 生成微前端元信息的 Vite 插件
 * 在开发模式下，在 devServer 启动时生成 micro-meta.json
 * 在打包后，通过 closeBundle 在 dist 目录中生成 micro-meta.json
 */
export function generateMicroMeta(options: GenerateMicroMetaOptions = {}): Plugin {
  const {
    packageRoot,
    outputDir,
    healthCheckUrl,
    includeDependencies = true,
    dependencyFilter
  } = options

  let resolvedPackageRoot: string | undefined
  let resolvedOutputDir: string | undefined

  return {
    name: 'qkt-plugin:generate-micro-meta',
    configResolved(config) {
      // 解析包根目录
      if (packageRoot) {
        resolvedPackageRoot = path.resolve(packageRoot)
      } else {
        // 默认从 Vite 的 root 配置推断
        resolvedPackageRoot = path.resolve(config.root || process.cwd())
      }

      // 解析输出目录
      if (outputDir) {
        resolvedOutputDir = path.resolve(outputDir)
      } else {
        // 默认使用 Vite 的 build.outDir
        const buildOutDir = config.build?.outDir || 'dist'
        resolvedOutputDir = path.resolve(resolvedPackageRoot, buildOutDir)
      }
    },
    configureServer(server) {
      // 开发模式：在 devServer 启动时生成
      return () => {
        const packageJsonPath = path.join(resolvedPackageRoot!, 'package.json')
        const meta = generateMetaData(packageJsonPath, {
          packageRoot: resolvedPackageRoot,
          outputDir: resolvedOutputDir,
          healthCheckUrl,
          includeDependencies,
          dependencyFilter
        })

        if (meta) {
          // 开发模式下，生成到 package.json 同目录
          const metaFilePath = path.join(resolvedPackageRoot!, 'micro-meta.json')
          writeMetaFile(metaFilePath, meta)
        }
      }
    },
    closeBundle() {
      // 生产模式：在构建完成后生成
      if (resolvedPackageRoot && resolvedOutputDir) {
        const packageJsonPath = path.join(resolvedPackageRoot, 'package.json')
        const meta = generateMetaData(packageJsonPath, {
          packageRoot: resolvedPackageRoot,
          outputDir: resolvedOutputDir,
          healthCheckUrl,
          includeDependencies,
          dependencyFilter
        })

        if (meta) {
          // 生产模式下，生成到输出目录
          const metaFilePath = path.join(resolvedOutputDir, 'micro-meta.json')
          writeMetaFile(metaFilePath, meta)
        }
      }
    }
  }
}
