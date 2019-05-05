const templates = require('@beautywe/framework');
const parsePath = require('../../libs/parse-path');
const config = require('../../libs/config');
const logger = require('../../libs/logger');
const _ = require('lodash');

/**
 * TODO
 * 1. 支持 spkg
 * 2. 支持写入 route 到 app.json 中
 */
function newPage({ pagePath, templateSource }) {
    const { baseName, pathName: targetDir, route, relativeToAppDir } = parsePath(pagePath);
    const pageRoute = `${route}/index`;

    logger.start(`创建页面：${pageRoute}`);
    return templates
        .render({
            type: 'page',
            targetDir,
            params: { name: baseName, route: pageRoute, relativeToAppDir },
            sourceDir: templateSource,
        })
        .then(result => result.forEach((item) => {
            logger.success(`生成文件：${item.targetPath.replace(config.projectDir, '')}`);
        }))
        .then(() => {
            // TODO
            // console.log(`写入路由：${pageRoute}`);
            // writeRoute(route);
        })
        .catch(err => logger.error(err))
        .then(() => logger.complete('创建页面完成'));
}

exports.newPage = newPage;

exports.command = 'page <path|name> [options]';

exports.desc = '创建一个页面';

exports.builder = function builder(yargs) {
    yargs
        .positional('path', {
            type: 'string',
            desc: '页面创建的相对路径，或者页面名字',
        })
        .option('n', {
            alias: 'name',
            type: 'string',
            desc: '页面名字，默认取页面文件夹名字',
        })
        .option('spkg', {
            alias: 'subpkg',
            type: 'boolean',
            desc: '是否分包下的页面。如果是，需要提供 path 参数',
            default: false,
        })
        .option('ts', {
            alias: 'template-source',
            type: 'string',
            desc: '模板资源的目录',
            default: '',
        });
};

exports.handler = function handler(argv) {
    const { path, ts } = argv;
    newPage({
        pagePath: path,
        templateSource: ts || _.get(config, 'templates.page.source'),
    });
};
