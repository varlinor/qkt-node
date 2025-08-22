# @varlinor/builder-vue2

该包为 Vue.js 开发环境提供了基于 Rollup 配置及工具函数，专注于简化前端开发的构建过程。它包含多个功能模块，包括构建 Vue 2 项目所需的 Rollup 配置、动态模块导入、文件路径处理、脚本和组件的构建等。这些工具对于希望优化构建流程并高效管理项目依赖的开发者来说尤其有用。

This package provides a set of Rollup configurations and utility functions tailored for Vue.js development environments, focusing on simplifying the build process for front-end development. It includes modules for configuring Rollup for Vue 2 projects, dynamic module imports, file path handling, and building scripts and components. These tools are particularly useful for developers looking to optimize their build processes and efficiently manage project dependencies.

## Installation

```bash
npm install -D @varlinor/builder-vue2

// or

pnpm add -D @varlinor/builder-vue2
```

## Usage

build vue2 and js package

```javascript
import path from 'path'
import * as Vue2Builder from '@varlinor/builder-vue2'
import { dependencies, devDependencies } from '../package.json'
// 由于 assert 语法需要高版本node支持，请注意
import ComponentDefines from './components.json' assert { type: 'json' }
import { normalizePath, getAllDependencies } from '@varlinor/node-tools'

const Def_DIST = './dist'
const entries = []
const externals = getAllDependencies(dependencies)
const devExternals = getAllDependencies(devDependencies)
externals.push(...devExternals)

const buildOpts = Vue2Builder.createPackObj(ComponentDefines, Def_DIST, 'esm', { externals })

// 更改返回结构
const modifier = (file, filePath, parentPath) => {
  let name = path.basename(filePath, '.js')
  return { name, input: filePath }
}
// 过滤文件
const filter = (file, filePath, parentPath) => {
  return filePath.endsWith('.js')
}
const extJsFiles = scanFilesByConditions('./src/', modifier, filter)
const jsOpts = Vue2Builder.createPackObjForJS(extJsFiles, Def_DIST, 'esm', { externals })

export default [...jsOpts, ...buildOpts]
```

## API Documentation

### Vue2 builders

1. **createBuildOptions(taskInfos = [], commonOpts)**

   - **描述**: 根据提供的任务信息和通用选项生成构建任务配置，用于批量构建多个项目或文件。
   - **Description**: Generates build task configurations based on provided task information and common options, used for batch building multiple projects or files.

2. **createPackObj(taskInfos = [], commonOpts)**

   - **描述**: 根据提供的任务信息和通用选项生成打包用的配置对象。
   - **Description**: Generate packaging configurations for script files for Vue 3 projects.

3. **createPackObjForJS(taskInfos = [], commonOpts)**

   - **描述**: 根据提供的任务信息和通用选项生成打包js脚本的配置对象。
   - **Description**: Generate build options for JavaScript files for specified component definitions and output directories, supporting different output formats and Rollup configurations.

4. **preparePackageBuildOptions(comDefines, distDir, format = 'es', rollupOpts = {})**

   - **描述**: 为指定的组件定义和输出目录生成包构建选项，支持不同的输出格式和 Rollup 配置。
   - **Description**: Generates package build options for specified component definitions and output directory, supporting different output formats and Rollup configurations.

5. **preparePackageBuildOptionsOnlyJS(comDefines, distDir, format = 'es', rollupOpts = {})**

   - **描述**: 为指定的组件定义和输出目录生成 javascript 文件的构建选项，支持不同的输出格式和 Rollup 配置。
   - **Description**: Create a configuration object for packaging JavaScript scripts based on the provided task information and common options.
