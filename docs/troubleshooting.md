# 常见问题/故障排除

Troubleshooting Guide

## 概述

本文档收集了使用 varlinor-node 工具集时可能遇到的常见问题及其解决方案。

This document collects common issues and solutions when using the varlinor-node toolkit.

## 安装问题

### 问题 1: 安装失败 - 找不到模块

**错误信息**:
```
Error: Cannot find module '@varlinor/builder-vue3'
```

**可能原因**:
1. 包未正确安装
2. node_modules 损坏
3. 包管理器缓存问题

**解决方案**:

```bash
# 清理缓存并重新安装
# pnpm
pnpm store prune
rm -rf node_modules
pnpm install

# npm
npm cache clean --force
rm -rf node_modules
npm install

# yarn
yarn cache clean
rm -rf node_modules
yarn install
```

### 问题 2: 版本冲突

**错误信息**:
```
peer dependency conflict
```

**解决方案**:

检查并统一依赖版本：

```bash
# 查看当前安装的版本
npm list vite vue @vitejs/plugin-vue

# 使用 resolutions (pnpm/yarn) 或 overrides (npm) 强制版本
```

在 `package.json` 中添加：

```json
{
  "pnpm": {
    "overrides": {
      "vite": "^5.4.20",
      "@vitejs/plugin-vue": "^5.2.4"
    }
  }
}
```

### 问题 3: 权限错误（Windows）

**错误信息**:
```
EACCES: permission denied
```

**解决方案**:

1. 以管理员身份运行终端
2. 或使用 `--unsafe-perm` 标志：

```bash
npm install --unsafe-perm
```

## 构建问题

### 问题 1: 构建失败 - 找不到 components.json

**错误信息**:
```
Error: Cannot find components.json in dir [...]
```

**原因**: `buildPackage` 函数需要在包根目录存在 `components.json` 文件。

**解决方案**:

1. 确保在正确的目录下运行构建
2. 使用 `qkt-cli generate define` 生成 `components.json`：

```bash
qkt-cli generate define -t -e
```

3. 或手动创建 `components.json`（参考相关文档）

### 问题 2: 构建失败 - 外部依赖未正确配置

**错误信息**:
```
Error: 'vue' is not defined
```

**原因**: Vue 等依赖被错误地打包进构建产物。

**解决方案**:

确保在 `packOption` 中正确配置 `externals`：

```javascript
const packOption = {
  externals: [
    /^vue/,
    /^@varlinor\//,
    // 添加其他需要外部化的依赖
  ],
  // ...
}
```

### 问题 3: 构建速度慢

**可能原因**:
1. 入口文件过多
2. 未使用缓存
3. 依赖解析慢

**解决方案**:

1. **优化入口文件**: 减少不必要的入口文件
2. **启用构建缓存**: Vite 默认启用缓存，确保 `.vite` 目录未被删除
3. **使用并行构建**: 确保 Node.js 有足够的资源

```javascript
// 在构建脚本中
process.env.NODE_OPTIONS = '--max-old-space-size=4096'
```

### 问题 4: CSS 未正确注入

**错误信息**: 构建后的组件缺少样式

**解决方案**:

确保安装了 `vite-plugin-css-injected-by-js`：

```bash
npm install -D vite-plugin-css-injected-by-js
```

该插件会自动处理 CSS 注入，无需额外配置。

### 问题 5: 路径别名不工作

**错误信息**:
```
Cannot resolve '@varlinor/module-admin'
```

**解决方案**:

1. 确保在 `packOption` 中配置了 `alias`：

```javascript
const packOption = {
  alias: {
    '@varlinor/module-admin': path.resolve('./src')
  },
  // ...
}
```

2. 如果使用 TypeScript，确保 `tsconfig.json` 中也配置了路径：

```json
{
  "compilerOptions": {
    "paths": {
      "@varlinor/module-admin": ["./src"]
    }
  }
}
```

## CLI 问题

### 问题 1: qkt-cli 命令未找到

**错误信息**:
```
'qkt-cli' is not recognized as an internal or external command
```

**解决方案**:

1. **全局安装**:

```bash
npm install -g @varlinor/cli
```

2. **使用 npx**:

```bash
npx @varlinor/cli <command>
```

3. **使用 pnpm**:

```bash
pnpm dlx @varlinor/cli <command>
```

### 问题 2: semver 命令失败

**错误信息**:
```
Error: must be runned in project root directory
```

**解决方案**:

确保在项目根目录（包含 `package.json` 和 `.gitignore` 的目录）运行命令。

### 问题 3: generate define 命令无响应

**可能原因**:
1. 交互式选择界面卡住
2. 终端不支持交互式输入

**解决方案**:

1. 确保终端支持交互式输入（非 CI 环境）
2. 如果必须非交互式运行，考虑使用脚本自动化

### 问题 4: tag 命令删除失败

**错误信息**:
```
Error: Failed to delete remote tags
```

**解决方案**:

1. 检查 Git 远程仓库权限
2. 确保有删除标签的权限
3. 检查网络连接

```bash
# 先测试本地删除
qkt-cli tag -f snapshot

# 再测试远程删除
qkt-cli tag -f snapshot -r
```

## 插件问题

### 问题 1: vue3SfcAdapter 不工作

**错误信息**: `.vue` 文件无法正确导入

**解决方案**:

1. 确保插件配置正确：

```javascript
import { vue3SfcAdapter } from '@varlinor/node-tools/plugins'

export default defineConfig({
  plugins: [
    vue3SfcAdapter(['@varlinor/']) // 传入需要处理的包作用域
  ]
})
```

2. 确保 `@vitejs/plugin-vue` 已安装并配置

### 问题 2: dynamicImport 插件不生效

**错误信息**: 动态导入未正确转换

**解决方案**:

1. 确保 `componentsMap` 配置正确
2. 检查插件执行顺序（应放在 `pre` 阶段）

```javascript
import { dynamicImport } from '@varlinor/node-tools/plugins'

export default defineConfig({
  plugins: [
    dynamicImport({
      componentsMap: {
        '@varlinor/component-a': './path/to/component-a'
      }
    })
  ]
})
```

### 问题 3: resolveDirImport 在单包项目中报错

**错误信息**: 找不到 packages 目录

**解决方案**:

`resolveDirImport` 主要用于 monorepo 场景。在单包项目中使用时，需要正确配置 `basePath` 和 `subPackageBase`：

```javascript
import { resolveDirImport } from '@varlinor/node-tools/plugins'

// 单包项目可以不使用此插件，或配置为项目根目录
resolveDirImport({
  basePath: process.cwd(),
  subPackageBase: './'
})
```

## 路径问题

### 问题 1: Windows 路径问题

**错误信息**: 路径分隔符错误

**解决方案**:

使用 `normalizePath` 函数处理路径：

```javascript
import { normalizePath } from '@varlinor/node-tools'

const path = normalizePath('C:\\Users\\Project\\src')
// 结果: 'C:/Users/Project/src'
```

### 问题 2: 相对路径解析错误

**错误信息**: 无法解析相对路径

**解决方案**:

使用绝对路径或确保工作目录正确：

```javascript
import path from 'path'

const packageRoot = path.resolve(process.cwd())
// 或
const packageRoot = normalizePath(path.resolve(__dirname, '..'))
```

## 性能问题

### 问题 1: 构建时间过长

**可能原因**:
1. 入口文件过多
2. 依赖解析慢
3. 未使用缓存

**解决方案**:

1. **减少入口文件**: 合并相关入口
2. **启用缓存**: 确保 `.vite` 目录存在且未被清理
3. **优化依赖**: 使用 `externals` 排除不需要打包的依赖
4. **并行构建**: 使用多进程构建（如果支持）

### 问题 2: 内存不足

**错误信息**:
```
JavaScript heap out of memory
```

**解决方案**:

增加 Node.js 内存限制：

```bash
# 在构建脚本中
NODE_OPTIONS=--max-old-space-size=4096 npm run build

# 或在 package.json 中
{
  "scripts": {
    "build": "NODE_OPTIONS=--max-old-space-size=4096 node build.js"
  }
}
```

## TypeScript 问题

### 问题 1: 类型定义找不到

**错误信息**:
```
Cannot find module '@varlinor/builder-vue3' or its type definitions
```

**解决方案**:

1. 确保安装了最新版本的包
2. 检查 `tsconfig.json` 配置：

```json
{
  "compilerOptions": {
    "moduleResolution": "node",
    "esModuleInterop": true
  }
}
```

3. 重启 TypeScript 服务器（在 IDE 中）

### 问题 2: 类型错误

**错误信息**: TypeScript 类型检查失败

**解决方案**:

1. 确保使用兼容的 TypeScript 版本（>= 5.0.0）
2. 检查类型定义是否正确导入
3. 查看具体错误信息，可能需要类型断言

## 依赖问题

### 问题 1: 循环依赖

**错误信息**: 构建时出现循环依赖警告

**解决方案**:

1. 重构代码结构，消除循环依赖
2. 使用动态导入延迟加载
3. 提取公共模块

### 问题 2: 依赖版本冲突

**解决方案**:

使用包管理器的依赖解析功能：

```json
{
  "pnpm": {
    "overrides": {
      "lodash-es": "^4.17.21"
    }
  }
}
```

## 调试技巧

### 启用详细日志

```javascript
// 在构建脚本中
process.env.DEBUG = 'varlinor:*'
```

### 检查构建配置

```javascript
// 打印构建配置
console.log('Build config:', JSON.stringify(packOption, null, 2))
```

### 使用 Vite 调试模式

```bash
# 启用 Vite 调试
DEBUG=vite:* npm run build
```

## 获取帮助

如果以上解决方案无法解决您的问题，请：

1. 查看 [版本兼容性说明](./compatibility.md)
2. 查看 [系统要求文档](./requirements.md)
3. 查看各包的 [CHANGELOG](../packages/)
4. 在 GitHub 上提交 [Issue](https://github.com/varlinor/qkt-node/issues)

## 相关文档

- [系统要求和环境依赖](./requirements.md)
- [版本兼容性说明](./compatibility.md)



