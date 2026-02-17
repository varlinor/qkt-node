# 版本兼容性说明

Version Compatibility Guide

## 概述

本文档详细说明了 varlinor-node 工具集与各种依赖包的版本兼容性。

This document details the version compatibility of the varlinor-node toolkit with various dependency packages.

## 包版本兼容性矩阵

### @varlinor/builder-vue3

| 包版本 | Vite | Vue | @vitejs/plugin-vue | Node.js | 状态 |
|--------|------|-----|-------------------|---------|------|
| 2.2.0+ | >= 5.0.0 | >= 3.0.0 | >= 5.0.0 | >= 18.0.0 | ✅ 支持 |
| 2.1.x | >= 5.0.0 | >= 3.0.0 | >= 5.0.0 | >= 18.0.0 | ⚠️ 已弃用 |
| 2.0.x | >= 5.0.0 | >= 3.0.0 | >= 5.0.0 | >= 18.0.0 | ⚠️ 已弃用 |

### @varlinor/node-tools

| 包版本 | Node.js | TypeScript | 状态 |
|--------|---------|-----------|------|
| 2.2.0+ | >= 18.0.0 | >= 5.0.0 (可选) | ✅ 支持 |
| 2.1.x | >= 18.0.0 | >= 5.0.0 (可选) | ⚠️ 已弃用 |
| 2.0.x | >= 18.0.0 | >= 5.0.0 (可选) | ⚠️ 已弃用 |

### @varlinor/cli

| 包版本 | Node.js | Git | 状态 |
|--------|---------|-----|------|
| 2.0.4+ | >= 18.0.0 | >= 2.30.0 | ✅ 支持 |
| 2.0.x | >= 18.0.0 | >= 2.30.0 | ✅ 支持 |

## Vite 版本兼容性

### Vite 5.x

✅ **完全支持**

```json
{
  "vite": "^5.4.0"
}
```

- 所有功能正常
- 推荐使用最新稳定版本

### Vite 4.x

❌ **不支持**

Vite 4.x 与当前版本不兼容，请升级到 Vite 5.x。

Vite 4.x is not compatible with the current version, please upgrade to Vite 5.x.

## Vue 版本兼容性

### Vue 3.x

✅ **完全支持**

```json
{
  "vue": "^3.4.0"
}
```

#### 支持的 Vue 3 版本

- **Vue 3.4+**: ✅ 完全支持，推荐使用
- **Vue 3.3.x**: ✅ 支持
- **Vue 3.2.x**: ✅ 支持
- **Vue 3.1.x**: ⚠️ 支持但不推荐（建议升级）
- **Vue 3.0.x**: ⚠️ 支持但不推荐（建议升级）

### Vue 2.x

❌ **不支持**

`@varlinor/builder-vue3` 不支持 Vue 2。如需 Vue 2 支持，请使用 `@varlinor/builder-vue2`。

`@varlinor/builder-vue3` does not support Vue 2. For Vue 2 support, please use `@varlinor/builder-vue2`.

## Node.js 版本兼容性

### Node.js 18.x

✅ **完全支持**

- Node.js 18.0.0 - 18.19.x: ✅ 支持
- 推荐使用 LTS 版本（18.x LTS）

### Node.js 20.x

✅ **完全支持（推荐）**

- Node.js 20.0.0+: ✅ 完全支持
- 推荐使用 LTS 版本（20.x LTS）
- 更好的性能和稳定性

### Node.js 22.x

✅ **支持**

- Node.js 22.0.0+: ✅ 支持
- 最新特性支持

### Node.js 16.x 及以下

❌ **不支持**

Node.js 16 及以下版本不支持，必须使用 Node.js 18.0.0 或更高版本。

Node.js 16 and below are not supported. Node.js 18.0.0 or higher is required.

## TypeScript 版本兼容性

### TypeScript 5.x

✅ **完全支持（推荐）**

```json
{
  "typescript": "^5.9.0"
}
```

### TypeScript 4.x

⚠️ **部分支持**

- TypeScript 4.9.x: ⚠️ 支持但不推荐
- 某些新特性可能不可用

### TypeScript 3.x 及以下

❌ **不支持**

## 包管理器兼容性

### pnpm

✅ **完全支持（推荐）**

- pnpm 8.x: ✅ 完全支持
- pnpm 9.x: ✅ 完全支持
- 推荐使用最新版本

### npm

✅ **支持**

- npm 9.x: ✅ 支持
- npm 10.x: ✅ 支持
- 推荐使用 npm 10.x

### yarn

✅ **支持**

- Yarn 3.x (Berry): ✅ 支持
- Yarn 1.x (Classic): ⚠️ 支持但不推荐

## 操作系统兼容性

### Windows

✅ **完全支持**

- Windows 10: ✅ 支持
- Windows 11: ✅ 支持
- Windows Server 2019+: ✅ 支持

### macOS

✅ **完全支持**

- macOS 10.15 (Catalina): ✅ 支持
- macOS 11+ (Big Sur): ✅ 支持
- macOS 12+ (Monterey): ✅ 支持
- macOS 13+ (Ventura): ✅ 支持
- macOS 14+ (Sonoma): ✅ 支持

### Linux

✅ **完全支持**

- Ubuntu 20.04+: ✅ 支持
- Ubuntu 22.04+: ✅ 完全支持（推荐）
- Debian 11+: ✅ 支持
- CentOS 8+: ✅ 支持
- RHEL 8+: ✅ 支持
- Fedora 36+: ✅ 支持

## 插件兼容性

### @varlinor/node-tools/plugins

#### vue3SfcAdapter

| Vite 版本 | 状态 |
|-----------|------|
| >= 5.0.0 | ✅ 完全支持 |
| < 5.0.0 | ❌ 不支持 |

#### dynamicImport

| Rollup 版本 | 状态 |
|------------|------|
| >= 4.0.0 | ✅ 完全支持 |
| < 4.0.0 | ⚠️ 可能不兼容 |

#### svgBuilder

| Vite 版本 | 状态 |
|-----------|------|
| >= 5.0.0 | ✅ 完全支持 |
| < 5.0.0 | ❌ 不支持 |

#### resolveDirImport

| 项目类型 | 状态 |
|---------|------|
| Monorepo | ✅ 完全支持 |
| 单包项目 | ✅ 支持 |

#### resolveGlobImports

| unbuild 版本 | 状态 |
|-------------|------|
| >= 3.0.0 | ✅ 完全支持 |
| < 3.0.0 | ⚠️ 可能不兼容 |

## 破坏性变更

### 从 2.1.x 升级到 2.2.0

#### @varlinor/builder-vue3

- ✅ 无破坏性变更
- 修复了 glob 处理机制

#### @varlinor/node-tools

- ✅ 无破坏性变更
- 新增 `resolveDirImport` 和 `resolveGlobImports` 插件

### 从 2.0.x 升级到 2.1.x

- ⚠️ 某些 API 可能有轻微变化
- 建议查看 [CHANGELOG](../packages/builder-vue3/CHANGELOG.md)

## 已知兼容性问题

### 问题 1: Vite 5.0.0 的某些早期版本

**问题**: Vite 5.0.0 的某些早期版本可能存在兼容性问题。

**解决方案**: 升级到 Vite 5.4.0 或更高版本。

### 问题 2: pnpm 7.x

**问题**: pnpm 7.x 在某些情况下可能无法正确解析 workspace 依赖。

**解决方案**: 升级到 pnpm 8.x 或更高版本。

### 问题 3: Windows 路径处理

**问题**: 在 Windows 上，某些路径处理可能需要额外注意。

**解决方案**: 使用 `normalizePath` 函数处理路径，确保跨平台兼容性。

## 测试矩阵

### 持续测试的版本组合

| Node.js | pnpm | Vite | Vue | 状态 |
|---------|------|------|-----|------|
| 18.20.0 | 8.15.0 | 5.4.20 | 3.4.21 | ✅ 通过 |
| 20.11.0 | 9.0.0 | 5.4.20 | 3.4.21 | ✅ 通过 |
| 22.0.0 | 9.0.0 | 5.4.20 | 3.4.21 | ✅ 通过 |

## 升级建议

### 推荐配置

```json
{
  "engines": {
    "node": ">=18.0.0"
  },
  "dependencies": {
    "vite": "^5.4.20",
    "vue": "^3.4.21",
    "@vitejs/plugin-vue": "^5.2.4"
  },
  "devDependencies": {
    "@varlinor/builder-vue3": "^2.2.0",
    "@varlinor/node-tools": "^2.2.0",
    "@varlinor/cli": "^2.0.4"
  }
}
```

## 相关文档

- [系统要求和环境依赖](./requirements.md)
- [常见问题/故障排除](./troubleshooting.md)



