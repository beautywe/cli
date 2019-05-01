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
    templates: _.defaultsDeep(userConfig.templates, {
        component: {
            // 不指定，则用 beautywe-framework 默认提供的模板
            source: undefined,
            defaultOutput: `${appDir}/components`,
        },
        page: {
            // 不指定，则用 beautywe-framework 默认提供的模板
            source: undefined,
            defaultOutput: `${appDir}/pages`,
        },
        plugin: {
            // 不指定，则用 beautywe-framework 默认提供的模板
            source: undefined,
            defaultOutput: `${appDir}/libs/plugins`,
        },
    }),
};

module.exports = config;
