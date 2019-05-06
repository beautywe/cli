# BeautyWe CLI

[![CircleCI](https://circleci.com/gh/beautywe/cli/tree/master.svg?style=svg)](https://circleci.com/gh/beautywe/cli/tree/master)

[![NPM Version](https://img.shields.io/npm/v/@beautywe/cli.svg)](https://www.npmjs.com/package/@beautywe/cli) [![NPM Downloads](https://img.shields.io/npm/dm/@beautywe/cli.svg)](https://www.npmjs.com/package/@beautywe/cli)

## 介绍

beautywe-cli 提供了以下功能：
1. 创建
    1. 快速创建应用
    2. 快速创建页面
        1. 支持分包机制
        2. 自动写入路由到 `app.json`
    3. 快速创建插件
    4. 自定义创建模板
2. 运行
    1. 开发环境构建
    2. 测试环境构建
    3. 打包发布构建

## 安装

```
$ npm i @beautywe/cli
```

## new 命令

### new app
```
$ beautywe new app
```

通过回答几个预设的问题，就能创建一个应用。    
该应用基于 beautywe-framework 构建，具体该框架的文档参考：[BeautyWe Framework](https://beautywe.github.io/docs/#/contents/framework/introduce)

### new page

```
$ beautywe new page <name|path>
```

快速创建页面，创建的页面包含以下四个文件：

1. xxx/index.js
2. xxx/index.json
3. xxx/index.scss
4. xxx/index.wxml

**<name|path> 逻辑**：
 1. 如果name只提供页面名称（例如name: 'myPage'），则最终生成的目录是 `{defaultRoot}/myPage`。
 1. 如果name是相对路径（例如name: 'path/myPage'），则最终生成的目录是 `{defaultRoot}/path/myPage`。
 1. 如果name是绝对路径（例如name: '/some/path/myPage'），则最终生成的目录是 `{project}/some/path/myPage`。
 1. 如果name只填写了路径（例如name: '/some/path/'），则当做 '/some/path' 处理。

> 其中 `{project}` 为项目目录，即 `package.json` 所在的目录
> 其中 `{defaultRoot}` 默认为 `app.json` 所在目录，可以通过 `.beautywerc` 中的 `defaultOutput` 来进行自定义。    


**--subpkg**

当创建的页面属于分包页面，这样创建：

```shell
$ beautywe new page abc --subpkg goods

[beautywe] › ▶  start     创建页面：/goods/pages/abc/index
[beautywe] › ✔  success   生成文件：src/goods/pages/abc/index.js
[beautywe] › ✔  success   生成文件：src/goods/pages/abc/index.json
[beautywe] › ✔  success   生成文件：src/goods/pages/abc/index.scss
[beautywe] › ✔  success   生成文件：src/goods/pages/abc/index.wxml
[beautywe] › ☒  complete  创建页面完成
```

**--write-route**

当创建路由的同时，需要自动写入路由到 `app.json` 文件：

```shell
# 主包页面
$ beautywe new page abc --write-route

# 分包页面
$ beautywe new page abc --subpkg goods --write-route
```

> 也可以通过 `.beautywerc` 中的 `writeRouteAfterCreated` 进行全局配置

### new plugin

```
$ beautywe new plugin <name> [dir]
```

### new component

```
$ beautywe new component <name|path>
```

**<name|path> 逻辑**：跟 `new page` 一致

#### 说明

快速创建一个插件文件

- **name**: 插件名，默认是命令执行的当前文件夹。
- **dir**: 可选项，可以指定插件文件生成的文件夹

#### 示例

运行下面命令

```
$ beautywe new plugin my-plugin

[beautywe] › ▶  start     创建插件：my-plugin
[beautywe] › ✔  success   生成文件：/my-plugin.js
[beautywe] › ☒  complete  创建插件完成
```

就会在当前目录创建 `./my-plugin.js`: 

```javascript
module.exports = function plugin(options) {
    // 这里可以通过 options 做可配置化逻辑。
    const pluginName = 'my-plugin';

    return {
        // 插件名
        name: pluginName,

        // 存放你的 data，会合并到 theHost.${pluginName}.name
        data: {
            name: pluginName,
        },

        // 原生生命周期钩子，会混合到 theHost.onShow
        nativeHook: {
            onShow() {

            },
        },

        // 视图层事件监听，会混合到 theHost.onClick
        handler: {
            onClick(event) {
                // 处理你的逻辑
            },
        },

        // 自定义方法，会合并到 theHost.${pluginName}.sayHello
        customMethod: {
            sayHello() {
                console.log('Hello!');
            },
        },

        // 插件装载前的钩子
        beforeAttach({ theHost }) {
            console.log(`plugin(${pluginName}) will be attaching`, { theHost });
        },

        // 插件装载完的钩子
        attached({ theHost }) {
            console.log(`plugin(${pluginName}) was attached`, { theHost });
        },

        // 插件初始化方法，会在宿主启动的时候执行
        initialize({ theHost }) {
            console.log(`plugin(${pluginName}) has initialized`, { theHost });
        },
    };
};
```

### new plugin-module

```
$ beautywe new plugin-module
```

#### 说明

快速创建一个，集成了 **eslint 规范**、**commit 规范**、**单元测试**、**测试覆盖率** 等内容，你只需编写最关键的插件代码

#### 示例

运行命令，回答几个问题，就能快速创建一个 NPM 插件模块：

```
$ beautywe new plugin-module

? pluginName: my-plugin
? moduleName: @beautywe/beautywe-plugin-my-plugin
? desc: Just my plugin
? version: 0.0.1
? 这样可以么: 
{
    "pluginName": "my-plugin",
    "moduleName": "@beautywe/beautywe-plugin-my-plugin",
    "desc": "Just my plugin",
    "version": "0.0.1"
}
 Yes
[beautywe] › ▶  start     开始创建插件模块：@beautywe/beautywe-plugin-my-plugin
[beautywe] › ✔  success   生成文件：/beautywe-plugin-my-plugin/.babelrc
[beautywe] › ✔  success   生成文件：/beautywe-plugin-my-plugin/.eslintignore
[beautywe] › ✔  success   生成文件：/beautywe-plugin-my-plugin/.eslintrc
[beautywe] › ✔  success   生成文件：/beautywe-plugin-my-plugin/.npmignore.disable
[beautywe] › ✔  success   生成文件：/beautywe-plugin-my-plugin/README.md
[beautywe] › ✔  success   生成文件：/beautywe-plugin-my-plugin/package.json
[beautywe] › ✔  success   生成文件：/beautywe-plugin-my-plugin/src/plugin.js
[beautywe] › ✔  success   生成文件：/beautywe-plugin-my-plugin/test/plugin.test.js
[beautywe] › ✔  success   插件模块已创建完成
```


## run 命令

run 命令底层是调用了 gulp 任务。    
该命令的适用范围是用来适配 beautywe-framework 的

`beautywe run dev` = `gulp dev`

## .beautywerc

当运行 `$ beautywe` 的时候，会在命令运行的当前文件夹向上回溯寻找 rc 文件，直到系统的根目录为止。

```json
{
    // 给 beautywe new 命令，指定自定义模板
    "templates": {

        // new component
        "component": {
            // 模板文件所在的目录
            "source": ".templates/component",

            // 新文件输出的默认目录
            "defaultOutput": "src/components"
        },

        // new page
        "page": {
            // 模板文件虽在的目录
            "source": ".templates/page",

            // 新文件输出的默认目录
            "defaultOutput": "src/pages"
        },

        // new plugin
        "plugin": {
            // 模板文件虽在的目录
            "source": ".templates/plugin",

            // 新文件输出的默认目录
            "defaultOutput": "src/libs/plugins"
        }
    },

    // 项目构建输出的目标目录
    "distDir": "dist",

    // 项目源码目录
    "appDir": "src",

    // 在页面创建之后是否自动写入路由
    "writeRouteAfterCreated": true
}
```

## templates


### 自定义模板

创建的三个命令：`new page`, `new component`, `new plugin` 是支持自定义模板的。    
默认的模板在 `@beautywe/framework` 中：[.templates](https://github.com/beautywe/framework/tree/master/templates/app/.templates)

当然你可以自定义自己的模板，把它们放在你的项目中，可以这样做：

1. 你可以复制 `@beautywe/framework` 默认的 `.templates` 到你的项目中，然后自定义修改。
2. 然后新增 `.beautywerc` 文件，修改 `templates` 中的 `sorce` 目录，如 page:
    ```
    "templates": {
        "page": {
            // 模板文件所在的目录
            "source": ".templates/page",

            // 新文件输出的默认目录
            "defaultOutput": "src/pages"
        },
    }
    ```
3. 最后你运行 `$ beautywe new page`，程序就会从你指定的 `source` 去读取创建文件的模板。
4. `new component`, `new plugin` 同理

### 模板参数

不同的模板，分别会注入不同的参数，方便满足特定需求。    
如默认模板中 [.templates/page/index.js](https://github.com/beautywe/framework/blob/master/templates/app/.templates/page/index.js):

```javascript
import MyPage from '<%= relativeToAppDir %>/libs/my-page';

MyPage({
    onLoad() {
        console.log('on page load');
    },
});
```

其中 `relativeToAppDir` 就是文件路径相对于应用目录的相对路径距离。    
其逻辑：
* 输入：
    * from: `/data/orandea/test/aaa`
    * to: `/data/orandea`
* 输出：`../../`

> 该功能主要由 node.js 的 [`path.relative`](https://nodejs.org/dist/latest-v12.x/docs/api/path.html#path_path_relative_from_to) 提供

不同模板注入的参数有差异化，如下：

**page**

| 变量名 | 说明 |
| --------- | --------- | 
| name | 页面名称，如 `/pages/homepage/index.xxx` 的页面名为 `homepage` |
| route | 相对于应用的路径，如：`/pages/homepage/index` |
| relativeToAppDir |  当前文件相对于应用目录的相对路径距离 |

**component**

| 变量名 | 说明 |
| --------- | --------- | 
| name | 插件，如 `/components/dailog/index.xxx` 的插件名为 `dailog` |
| route | 相对于应用的路径，如：`/components/dailog/index` |
| relativeToAppDir |  当前文件相对于应用目录的相对路径距离 |

**plugin**

| 变量名 | 说明 |
| --------- | --------- | 
| name | 插件，如 `/plugins/abc.js` 的插件名为 `abc` |
