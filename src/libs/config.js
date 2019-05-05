const nodePath = require('path');
const findUp = require('find-up');
const fs = require('fs');
const _ = require('lodash');

/**
 * 获取用户配置
 * 优先级：.beautywerc > .beautywerc.json > package.json.beautywe
 */
const rcPath = findUp.sync(['.beautywerc', '.beautywerc.json']);
const rcConfig = rcPath ? JSON.parse(fs.readFileSync(rcPath)) : {};
const pkgPath = findUp.sync('package.json');
const pkgConfig = rcPath ? JSON.parse(fs.readFileSync(pkgPath)).beautywe : {};
const userConfig = Object.assign({}, pkgConfig, rcConfig);

const projectDir = pkgPath ? nodePath.join(pkgPath, '../') : process.cwd();
const distDir = nodePath.join(projectDir, userConfig.distDir || 'dist');
const appDir = nodePath.join(projectDir, userConfig.appDir || 'src');

const config = {
    projectDir,
    distDir,
    appDir,
    writeRouteAfterCreated: _.get(userConfig, 'writeRouteAfterCreated', false),
    templates: {
        component: {
            // 不指定，则用 beautywe-framework 默认提供的模板
            source: _.get(userConfig, 'templates.component.source'),
            defaultOutput: nodePath.join(appDir, _.get(userConfig, 'templates.component.defaultOutput', 'components')),
        },
        page: {
            // 不指定，则用 beautywe-framework 默认提供的模板
            source: _.get(userConfig, 'templates.page.source'),
            defaultOutput: nodePath.join(appDir, _.get(userConfig, 'templates.page.defaultOutput', 'pages')),
        },
        plugin: {
            // 不指定，则用 beautywe-framework 默认提供的模板
            source: _.get(userConfig, 'templates.plugin.source'),
            defaultOutput: nodePath.join(appDir, _.get(userConfig, 'templates.plugin.defaultOutput', '/libs/plugins')),
        },
    },
};

module.exports = config;
