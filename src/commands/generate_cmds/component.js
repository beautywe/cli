const templates = require('@beautywe/framework');
const parsePath = require('../../libs/parse-path');
const config = require('../../libs/config');
const logger = require('../../libs/logger');
const _ = require('lodash');

function newComponent({ compPath, templateSource }) {
    const { baseName, pathName: targetDir, route, relativeToAppDir } = parsePath({ name: compPath, type: 'component' });
    const compRoute = `${route}/index`;

    logger.start(`创建组件：${compRoute}`);
    return templates
        .render({
            type: 'component',
            targetDir,
            params: { name: baseName, route: compRoute, relativeToAppDir },
            sourceDir: templateSource,
            relativeToAppDir,
        })
        .then(result => result.forEach((item) => {
            logger.success(`生成文件：${item.targetPath.replace(config.projectDir, '')}`);
        }))
        .then(() => logger.complete('创建组件完成'))
        .catch((err) => {
            logger.error(err);
            logger.error('创建组件失败');
        });
}

exports.newComponent = newComponent;

exports.command = 'component <path|name> [options]';

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
        .option('ts', {
            alias: 'template-source',
            type: 'string',
            desc: '模板资源的目录',
            default: '',
        });
};

exports.handler = function handler(argv) {
    const { path, ts } = argv;
    newComponent({
        compPath: path,
        templateSource: ts || _.get(config, 'templates.component.source'),
    });
};
