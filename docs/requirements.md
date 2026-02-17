# 系统要求和环境依赖

System Requirements and Environment Dependencies

## 概述

本文档详细说明了使用 varlinor-node 工具集所需的环境要求和依赖。

This document details the environment requirements and dependencies needed to use the varlinor-node toolkit.

## Node.js 版本要求

### 最低要求

- **Node.js**: >= 18.0.0

所有包都要求 Node.js 18.0.0 或更高版本。这是因为使用了现代 JavaScript 特性（如 ES Modules、可选链等）。

All packages require Node.js 18.0.0 or higher. This is due to the use of modern JavaScript features (such as ES Modules, optional chaining, etc.).

### 推荐版本

- **Node.js**: >= 20.0.0 (LTS)

推荐使用 Node.js 20.x LTS 版本，以获得更好的性能和稳定性。

It is recommended to use Node.js 20.x LTS version for better performance and stability.

### 验证 Node.js 版本

```bash
node --version
# 应该显示 v18.0.0 或更高版本
```

## 包管理器要求

### 支持的包管理器

- **pnpm**: >= 8.0.0 (推荐)
- **npm**: >= 9.0.0
- **yarn**: >= 3.0.0

### 推荐使用 pnpm

本项目在开发时使用 pnpm，推荐在生产环境中也使用 pnpm，以获得更好的依赖解析和性能。

This project uses pnpm during development, and it is recommended to use pnpm in production environments as well for better dependency resolution and performance.

### 安装 pnpm

```bash
# 使用 npm 安装
npm install -g pnpm

# 使用 corepack (Node.js 16.9+)
corepack enable
corepack prepare pnpm@latest --activate
```

## 操作系统兼容性

### 支持的操作系统

- **Windows**: Windows 10 或更高版本
- **macOS**: macOS 10.15 (Catalina) 或更高版本
- **Linux**: 主流 Linux 发行版（Ubuntu 20.04+, Debian 11+, CentOS 8+ 等）

### 路径处理

所有包都使用路径归一化处理，确保在不同操作系统下的兼容性。Windows 路径会自动转换为 Unix 风格路径。

All packages use path normalization to ensure compatibility across different operating systems. Windows paths are automatically converted to Unix-style paths.

## 依赖包版本要求

### @varlinor/builder-vue3

#### 必需依赖

- **Vite**: >= 5.0.0
- **@vitejs/plugin-vue**: >= 5.0.0
- **Vue**: >= 3.0.0

#### Peer Dependencies

以下依赖需要在使用项目中自行安装：

The following dependencies need to be installed in your project:

```json
{
  "@vitejs/plugin-vue": ">5.0.0",
  "vite": ">5.0.0",
  "vite-plugin-css-injected-by-js": "^3.5.2"
}
```

#### 其他依赖

- **unbuild**: >= 3.6.0 (用于构建脚本)
- **@rollup/plugin-replace**: >= 6.0.0
- **postcss-preset-env**: >= 10.0.0

### @varlinor/node-tools

#### 核心依赖

- **fs-extra**: >= 11.0.0
- **lodash-es**: >= 4.17.0
- **@inquirer/checkbox**: >= 4.0.0 (用于交互式选择)
- **fast-glob**: >= 3.0.0 (用于文件扫描)
- **acorn**: >= 8.0.0 (用于 AST 解析)
- **magic-string**: >= 0.30.0 (用于代码转换)

### @varlinor/cli

#### 核心依赖

- **commander**: >= 14.0.0
- **chalk**: >= 5.0.0
- **semver**: >= 7.0.0
- **simple-git**: >= 3.0.0
- **shelljs**: >= 0.10.0
- **yaml**: >= 2.0.0

## TypeScript 支持

### TypeScript 版本

虽然不是必需，但推荐使用 TypeScript 进行开发：

While not required, TypeScript is recommended for development:

- **TypeScript**: >= 5.0.0

### 类型定义

所有包都包含完整的 TypeScript 类型定义，无需额外安装 `@types/*` 包。

All packages include complete TypeScript type definitions, no need to install additional `@types/*` packages.

## 开发环境要求

### Git

- **Git**: >= 2.30.0 (用于 CLI 的版本管理和标签功能)

### 构建工具

- **unbuild**: 用于构建包本身（开发时）
- **rimraf**: 用于清理构建产物

## 浏览器兼容性

### 构建产物兼容性

使用 `@varlinor/builder-vue3` 构建的代码：

Code built with `@varlinor/builder-vue3`:

- **现代浏览器**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **目标**: ES2020+

### 浏览器支持策略

构建工具默认输出 ES2020 格式的代码，如需支持更旧的浏览器，请在 Vite 配置中设置相应的 `build.target`。

The build tool outputs ES2020 format code by default. If you need to support older browsers, set the appropriate `build.target` in your Vite configuration.

## 内存要求

### 推荐配置

- **RAM**: >= 8GB
- **可用磁盘空间**: >= 2GB

### 大型项目

对于包含大量组件的项目（>100 个组件），建议：

For projects with a large number of components (>100 components), it is recommended:

- **RAM**: >= 16GB
- **可用磁盘空间**: >= 5GB

## 网络要求

### npm 注册表访问

需要能够访问 npm 注册表（或配置的私有注册表）以下载依赖包。

Access to npm registry (or configured private registry) is required to download dependencies.

### 代理配置

如果使用代理，请确保正确配置：

If using a proxy, ensure proper configuration:

```bash
# npm
npm config set proxy http://proxy.example.com:8080
npm config set https-proxy http://proxy.example.com:8080

# pnpm
pnpm config set proxy http://proxy.example.com:8080
pnpm config set https-proxy http://proxy.example.com:8080
```

## 验证安装

### 检查 Node.js 版本

```bash
node --version
```

### 检查包管理器版本

```bash
# pnpm
pnpm --version

# npm
npm --version

# yarn
yarn --version
```

### 检查依赖安装

```bash
# 安装依赖后检查
npm list @varlinor/builder-vue3
npm list @varlinor/node-tools
npm list @varlinor/cli
```

## 常见问题

### Q: 可以使用 Node.js 16 吗？

A: 不可以。本项目使用了 Node.js 18+ 的特性，必须使用 Node.js 18.0.0 或更高版本。

### Q: 必须使用 pnpm 吗？

A: 不是必须的，但推荐使用。npm 和 yarn 也可以正常工作。

### Q: 支持 Vue 2 吗？

A: `@varlinor/builder-vue3` 仅支持 Vue 3。如需 Vue 2 支持，请使用 `@varlinor/builder-vue2`。

## 相关文档

- [版本兼容性说明](./compatibility.md)
- [常见问题/故障排除](./troubleshooting.md)



