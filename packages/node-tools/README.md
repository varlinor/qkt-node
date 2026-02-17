# @varlinor/node-tools

This package provides a collection of utility functions for Node.js environments, focusing on file operations, JSON parsing, dependency management, and Vue component scanning. It includes functions for recursively scanning directories, loading and parsing JSON files, managing dependencies, merging TypeScript configuration aliases, and offering interactive file selection. These tools are particularly useful for Node.js developers who need to streamline their build processes and manage project dependencies efficiently.

And plugins provides a series of Rollup plugins focused on simplifying the build process for front-end development. It includes plugins for generating SVG symbols, supporting Vue 3 Single File Components, and handling dynamic module imports. With these tools, developers can more efficiently manage resources, optimize build processes, and enhance project flexibility.

这个包提供了一组用于 Node.js 环境的实用函数，主要专注于文件操作、JSON 解析、依赖管理和 Vue 组件扫描。它包含用于递归扫描目录、加载和解析 JSON 文件、管理依赖项、合并 TypeScript 配置别名以及提供交互式文件选择的函数。这些工具对于需要简化构建流程和高效管理项目依赖项的 Node.js 开发者特别有用。

插件则提供了一系列专注于简化前端开发构建过程的 Rollup 插件。它包括用于生成 SVG 符号、支持 Vue 3 单文件组件以及处理动态模块导入的插件。通过这些工具，开发者可以更有效地管理资源、优化构建过程，并增强项目的灵活性。

## Requirements

- **Node.js**: >= 18.0.0
- **TypeScript**: >= 5.0.0 (可选，但推荐)

详细的环境要求和兼容性说明，请查看：
- [系统要求文档](../../docs/requirements.md)
- [版本兼容性说明](../../docs/compatibility.md)
- [常见问题/故障排除](../../docs/troubleshooting.md)

For detailed requirements and compatibility information, please see:
- [Requirements](../../docs/requirements.md)
- [Compatibility Guide](../../docs/compatibility.md)
- [Troubleshooting](../../docs/troubleshooting.md)

## Installation

```bash
npm install -D @varlinor/node-tools

// or

pnpm add -D @varlinor/node-tools
```

## Usage

```javascript
import {
  getAllDependencies,
  loadJsonFile,
  loadPackages,
  mergeBaseTsConfigAlias,
  normalizePath,
  removeFileExt,
  scanAllComponents,
  scanFiles,
  scanFilesByConditions,
  scanFilesByFilter,
  selectFiles,
  selectSfc
} from '@varlinor/node-tools'

import { dynamicImport, svgBuilder, vue3SfcAdapter, resolveDirImport, resolveGlobImports, generateMicroMeta } from '@varlinor/node-tools/plugins'
```

## API Documentation

### index

1. **scanFilesByConditions(dirPath, modifier, filter)**

   - **描述**: 递归扫描指定目录下的文件，应用可选的修饰器和过滤器来处理文件。返回文件列表或根据修饰器修改后的对象。
   - **Description**: Recursively scans files in a specified directory, applying optional modifiers and filters to process files. Returns a list of files or objects modified by the modifier.

2. **scanFiles(dirPath, modifier)**

   - **描述**: 使用`scanFilesByConditions`函数扫描目录文件，但不应用过滤器。
   - **Description**: Scans directory files using the scanFilesByConditions function without applying any filters.

3. **scanFilesByFilter(dirPath, filter)**

   - **描述**: 使用`scanFilesByConditions`函数扫描目录文件，应用指定的过滤器来选择文件。
   - **Description**: Scans directory files using the scanFilesByConditions function and applies the specified filter to select files.

4. **scanAllComponents(packages)**

   - **描述**: 扫描指定的包列表中的Vue组件，返回所有组件的路径映射。
   - **Description**: Scans the Vue components in the specified list of packages and returns a mapping of all component paths.

5. **loadJsonFile(filePath)**

   - **描述**: 读取并解析指定路径的JSON文件，返回解析后的对象。
   - **Description**: Reads and parses a JSON file from a specified path, returning the parsed object.

6. **loadPackages(baseDir, excludes)**

   - **描述**: 加载指定目录下的所有包，排除符合条件的目录，返回包名称和路径的别名列表。
   - **Description**: Loads all packages in the specified directory, excluding directories that match certain conditions, and returns a list of package names and path aliases.

7. **getAllDependencies(dependencies)**

   - **描述**: 提取并返回给定依赖项对象中的所有依赖项名称列表。
   - **Description**: Extracts and returns a list of all dependency names from the provided dependencies object.

8. **mergeBaseTsConfigAlias(baseRoot, baseConfigPath, pathAlias)**

   - **描述**: 合并TypeScript配置文件中的路径别名，根据新的别名更新`tsconfig.json`。
   - **Description**: Merges path aliases in the TypeScript configuration file and updates tsconfig.json based on the new aliases.

9. **selectFiles(options)**

   - **描述**: 根据给定选项扫描文件并提供选择文件的交互式界面。
   - **Description**: Scans files based on given options and provides an interactive interface for file selection.

10. **selectSfc(basePath, isTS)**
    - **描述**: 扫描指定目录下的Vue组件和TypeScript或JavaScript入口文件，提供选择组件的交互式界面。
    - **Description**: Scans Vue components and TypeScript or JavaScript entry files in the specified directory, providing an interactive interface for component selection.

11. **normalizePath(filePath)**
    - **描述**: 归一化文件路径，将反斜杠转换为正斜杠，确保路径在不同操作系统下的一致性。
    - **Description**: Normalizes file paths by converting backslashes to forward slashes, ensuring path consistency across different operating systems.

12. **removeFileExt(path)**
    - **描述**: 移除文件路径中的文件扩展名，返回不带扩展名的路径。
    - **Description**: Removes the file extension from a file path, returning the path without the extension.

### plugin

1. **svgBuilder(path, prefix = "local")**

   - **描述**: 根据指定路径和前缀生成SVG符号的Rollup插件，用于在HTML中插入SVG图标。
   - **Description**: A Rollup plugin that generates SVG symbols from the specified path and prefix, and inserts them into HTML.

2. **vue3SfcAdapter(scopes)**

   - **描述**: 适配Vue 3单文件组件的Rollup插件，通过自动解析文件扩展名和别名来支持.vue文件的导入。参数`scopes`是一个字符串数组，用于指定需要处理的包作用域（如`["@varlinor/"]`）。
   - **Description**: A Rollup plugin to adapt Vue 3 Single File Components (SFCs), supporting `.vue` file imports by automatically resolving file extensions and aliases. The `scopes` parameter is an array of strings specifying package scopes to handle (e.g., `["@varlinor/"]`).

3. **dynamicImport({ include, exclude, componentsMap, presetModules })**

   - **描述**: 一个动态导入的Rollup插件，用于根据给定的组件映射条件动态加载模块。
   - **Description**: A Rollup plugin for dynamic imports, designed to dynamically load modules based on the given component mapping conditions.

4. **resolveDirImport({ basePath, subPackageBase, scopes, exts })**

   - **描述**: 一个用于解析目录导入的Rollup插件，支持将目录路径自动解析为index文件。主要用于处理monorepo中跨包的目录导入。
   - **Description**: A Rollup plugin for resolving directory imports, automatically resolving directory paths to index files. Mainly used for handling cross-package directory imports in monorepo.

5. **resolveGlobImports({ basePath })**

   - **描述**: 一个用于解析`import.meta.glob`的Rollup插件，在构建时将glob模式转换为实际的导入语句。
   - **Description**: A Rollup plugin for resolving `import.meta.glob`, converting glob patterns to actual import statements during build.

6. **generateMicroMeta({ packageRoot, outputDir, healthCheckUrl, includeDependencies, dependencyFilter })**

   - **描述**: 一个用于生成微前端应用元信息的Vite插件。在开发模式下，在devServer启动时在package.json同目录生成micro-meta.json文件；在打包后，通过closeBundle在dist目录中生成micro-meta.json。元数据包含应用名称、版本、构建时间、健康检查URL（可选）和依赖信息。
   - **Description**: A Vite plugin for generating micro-frontend application metadata. In development mode, it generates micro-meta.json in the same directory as package.json when the devServer starts; after build, it generates micro-meta.json in the dist directory via closeBundle. The metadata includes application name, version, build time, health check URL (optional), and dependency information.
   - **参数/Parameters**:
     - `packageRoot?: string` - 包根目录，默认从Vite配置推断 / Package root directory, defaults to Vite config root
     - `outputDir?: string` - 输出目录，默认使用Vite的build.outDir / Output directory, defaults to Vite's build.outDir
     - `healthCheckUrl?: string` - 可选，健康检查URL / Optional health check URL
     - `includeDependencies?: boolean` - 是否包含依赖信息，默认true / Whether to include dependency information, default true
     - `dependencyFilter?: (depName: string) => boolean` - 依赖过滤函数，用于过滤不需要的依赖 / Dependency filter function to filter out unwanted dependencies


