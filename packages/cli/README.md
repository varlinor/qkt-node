# @varlinor/cli

该包提供了一系列用于管理和构建前端项目的命令行工具。这些工具包括清理项目的node_modules目录、创建和管理项目版本、删除Git标签、以及生成Vue组件的定义文件和入口文件等功能。通过这些CLI工具，开发者可以更高效地维护项目结构，管理版本控制，自动化常见的开发任务，并简化组件的生成和管理流程。

This package provides a set of command-line tools for managing and building front-end projects. These tools include functionalities for cleaning the node_modules directory, creating and managing project versions, removing Git tags, and generating Vue component definition files and entry files. With these CLI tools, developers can more efficiently maintain project structure, manage version control, automate common development tasks, and simplify the generation and management of components.

## Installation

```bash
npm install -D @varlinor/cli

// or

pnpm add -D @varlinor/cli
```

## Usage

1. **clean命令**

   - **功能**: 用于清理指定模块的`node_modules`目录。可以指定目录和模块名称，或使用当前路径。
   - **选项**:
     - `-c, --current-path`: 使用当前路径。
     - `-b, --base-dir`: 目标目录。
     - `-m, --module-name <moduleName>`: 模块名称。

   ```bash
   qkt-cli clean -b /path/to/base/dir -m moduleName
   ```

   或者使用当前路径：

   ```bash
   qkt-cli clean -c
   ```

2. **semver命令**

   - **功能**: 用于创建包版本，必须在项目根目录中运行。支持创建`major`、`minor`和`patch`版本，以及查看本地和远程的版本信息。
   - **选项**:
     - `-c, --create <createType>`: 指定创建的版本类型（`major`、`minor`、`patch`）。
     - `-i, --info`: 打印当前版本信息。
     - `-r, --remote`: 打印远程版本信息。
     - `-s, --snapshot <snapshotType>`: 为不同分支指定快照类型。
     - `-o, --output`: 替换`templates/package.json`中的版本。

在项目根目录中运行以创建或查看包的版本信息。

```bash
qkt-cli semver -c minor
```

查看当前版本信息：

```bash
qkt-cli semver -i
```

查看远程版本信息：

```bash
qkt-cli semver -r
```

为不同的分支指定快照类型：

```bash
qkt-cli semver -s datacore
```

替换`templates/package.json`中的版本：

```bash
qkt-cli semver -o
```

3. **tag命令**

   - **功能**: 用于删除无用的Git标签，必须在项目根目录中运行。可以选择清除本地或远程的标签。
   - **选项**:
     - `-r, --remote`: 清除远程标签。
     - `-o, --remoteName <remoteName>`: 指定要移除标签的远程名称。
     - `-f, --filterCode <filterCode>`: 用于过滤要删除的标签。

从本地和远程删除不需要的Git标签。

```bash
qkt-cli tag -f snapshot -r
```

指定远程名称：

```bash
qkt-cli tag -f snapshot -r -o origin
```

4. **generate define命令**
   - **功能**: 用于为包生成Vue组件的定义文件和入口文件。支持生成TypeScript或JavaScript的入口文件。
   - **选项**:
     - `-t, --isTs`: 指定源文件为TypeScript。
     - `-e, --isOutputEntry`: 是否创建入口文件。

为包生成Vue组件的定义文件和入口文件。

```bash
qkt-cli generate define -t -e
```
