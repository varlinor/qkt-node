# @varlinor/node-tools

## 2.2.1

### Patch Changes

- fix: 解决路径中存在多个src导致解析失败的bug

## 2.2.1-snapshot.0

### Patch Changes

- fix: 解决路径中存在多个src导致解析失败的bug

## 2.2.0

### Minor Changes

- fix: 修改ts代码中的glob处理机制

### Patch Changes

- feat: 支持二次开发包中动态加载插件的替换
- fix: 更改组件扫描的匹配范围，扩大到已打包的组件
- fix: 调整解析glob时输出的内容
- fix: 修正动态引用的错误内容

## 2.2.0-snapshot.4

### Patch Changes

- fix: 调整解析glob时输出的内容

## 2.2.0-snapshot.3

### Minor Changes

- fix: 修改ts代码中的glob处理机制

## 2.1.1-snapshot.2

### Patch Changes

- fix: 修正动态引用的错误内容

## 2.1.1-snapshot.1

### Patch Changes

- fix: 更改组件扫描的匹配范围，扩大到已打包的组件

## 2.1.1-snapshot.0

### Patch Changes

- feat: 支持二次开发包中动态加载插件的替换

## 2.1.0

### Minor Changes

- fix: 解决AST错误解析index.vue 报错的问题

## 2.0.2

### Patch Changes

- feat: support to create hook for unbuild and plugin for vite.

## 2.0.1

### Patch Changes

- fix: support auto scan packages info and auto fix dir import among multiple packages

## 2.0.0

### Major Changes

- 62470b9: chore: update dependencies

### Patch Changes

- fix: resolve multiple scope filter
- chore: modify exports formart in package.json
- feat: add dir import resolve plugin

## 2.0.0-snapshot.3

### Patch Changes

- fix: resolve multiple scope filter

## 2.0.0-snapshot.2

### Patch Changes

- chore: modify exports formart in package.json

## 2.0.0-snapshot.1

### Patch Changes

- feat: add dir import resolve plugin

## 2.0.0-snapshot.0

### Major Changes

- chore: update dependencies

## 1.2.0

### Minor Changes

- chore: 调整版本号

## 1.1.0

### Minor Changes

- 更新基础依赖的util，优化vue sfc入口文件的生成和定义文件生成逻辑

## 1.0.5

### Patch Changes

- e0df7b7: fix: update dynamic importer logic

## 1.0.5-snapshot.0

### Patch Changes

- fix: update dynamic importer logic

## 1.0.4

### Patch Changes

- refactor: 重构vue3-sfc-adapter对安装后的指定包、或者本地packages下指定包的加载机制，支持省略index的加载

## 1.0.3

### Patch Changes

- feat: 追加二次开发时对node_modules包中指定包的后缀的适配

## 1.0.3-snapshot.0

### Patch Changes

- feat: 追加二次开发时对node_modules包中指定包的后缀的适配

## 1.0.2

### Patch Changes

- build: test arguments for publish process
- feat: add multiple scope for vue3-sfc-adapter

## 1.0.2-snapshot.1

### Patch Changes

- feat: add multiple scope for vue3-sfc-adapter

## 1.0.2-snapshot.0

### Patch Changes

- build: test arguments for publish process

## 1.0.1

### Patch Changes

- 2cd666b: build: release all node tools

## 1.0.1-snapshot.0

### Patch Changes

- build: release all node tools
