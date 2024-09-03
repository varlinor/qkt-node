# @varlinor/builder

该包为 Vue.js 开发环境提供了一系列的 Rollup 和 Vite 配置及工具函数，专注于简化前端开发的构建过程。它包含多个功能模块，包括构建 Vue 2 和 Vue 3 项目所需的 Rollup 和 Vite 配置、动态模块导入、文件路径处理、脚本和组件的构建等。这些工具对于希望优化构建流程并高效管理项目依赖的开发者来说尤其有用。

This package provides a set of Rollup and Vite configurations and utility functions tailored for Vue.js development environments, focusing on simplifying the build process for front-end development. It includes modules for configuring Rollup and Vite for Vue 2 and Vue 3 projects, dynamic module imports, file path handling, and building scripts and components. These tools are particularly useful for developers looking to optimize their build processes and efficiently manage project dependencies.

## Installation

```bash
npm install -D @varlinor/builder

// or

pnpm add -D @varlinor/builder
```

## Usage

```javascript

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
