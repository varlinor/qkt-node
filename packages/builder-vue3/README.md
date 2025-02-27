# @varlinor/builder-vue3

该包为 Vue.js 开发环境提供了一系列的 Vite 配置及工具函数，专注于简化前端开发的构建过程。它包含多个功能模块，包括构建 Vue 3 项目所需的 Vite 配置、动态模块导入、文件路径处理、脚本和组件的构建等。这些工具对于希望优化构建流程并高效管理项目依赖的开发者来说尤其有用。

This package provides a set of Vite configurations and utility functions tailored for Vue.js development environments, focusing on simplifying the build process for front-end development. It includes modules for configuring Vite for Vue 3 projects, dynamic module imports, file path handling, and building scripts and components. These tools are particularly useful for developers looking to optimize their build processes and efficiently manage project dependencies.

## Installation

```bash
npm install -D @varlinor/builder-vue3

// or

pnpm add -D @varlinor/builder-vue3
```

## Usage

build vue3 package

```javascript
import path from 'path'
import { Vue2Builder, Vue3Builder } from '@varlinor/builder'
import { normalizePath } from '@varlinor/node-tools'

const packageRoot = normalizePath(process.cwd())
const i18nFiles = Vue3Builder.getI18nFiles(packageRoot)
const allEntries = [{ name: 'register', input: 'src/register.ts' }, ...i18nFiles]

const packOption = {
  externals: [/^@varlinor\//],
  enteries: allEnteries,
  alias: {
    '@varlinor/module-admin': path.resolve('./src')
  }
}

Vue3Builder.buildPackage(packageRoot, packOption)
```

build pure js package

```javascript
import path from 'path'
import { Vue3Builder } from '@varlinor/builder'
import { normalizePath } from '@varlinor/node-tools'

const packageRoot = normalizePath(process.cwd())
const allEnteries = [{ name: 'register', input: 'src/register.ts' }]

const storeFiles = Vue3Builder.getScriptFiles(`${packageRoot}/src/stores`)

allEnteries.push(...storeFiles)

const packOption = {
  externals: [/^@varlinor\//],
  enteries: allEnteries,
  alias: {
    '@varlinor/core': path.resolve('./src')
  }
}

Vue3Builder.buildScripts(packageRoot, packOption)
```

## API Documentation

### Vue3 builders

1. **getSfcBuildConfig(opts)**

   - **描述**: 为 Vue 3 项目生成 Vite 构建配置，支持单文件组件 (SFC) 的编译和打包。
   - **Description**: Generates Vite build configuration for Vue 3 projects, supporting the compilation and packaging of Single File Components (SFCs).

2. **getScriptBuildConfig(opts)**

   - **描述**: 为 Vue 3 项目生成 script 文件的打包配置。
   - **Description**: Generate a configuration object for packaging based on the provided task information and common options.

3. **buildScripts(packageRoot, packOption)**

   - **描述**: 构建指定包根目录下的脚本文件，使用动态模块导入和其他构建选项。
   - **Description**: Builds script files in the specified package root directory, utilizing dynamic module imports and other build options.

4. **buildPackage(packageRoot, packOption)**

   - **描述**: 构建整个包，包括组件和脚本文件，支持多种输出配置和依赖管理。
   - **Description**: Builds the entire package, including components and script files, supporting various output configurations and dependency management.

5. **getI18nFiles(packageRoot)**

   - **描述**: 获取指定包根目录下的所有 i18n 文件，用于国际化处理。
   - **Description**: Retrieves all i18n files in the specified package root directory for internationalization handling.

6. **getScriptFiles(packageRoot, entryFilter)**

   - **描述**: 获取并过滤指定包根目录下的脚本文件，支持按条件筛选入口文件。
   - **Description**: Retrieves and filters script files in the specified package root directory, supporting conditional entry file selection.
