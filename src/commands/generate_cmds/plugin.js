const templates = require('@beautywe/framework');
const parsePath = require('../../libs/parse-path');
const logger = require('../../libs/logger');
const config = require('../../libs/config');
const _ = require('lodash');

function newPlugin({ path }) {
    logger.start(`创建插件：${path}`);
    const { baseName, pathName: targetDir } = parsePath(path, 'plugin');
    return templates
        .render({
            type: 'plugin',
            targetDir,
            params: { name: baseName },
            fileName: `${baseName}.js`,
        })
        .then(result => result.forEach((item) => {
            logger.success(`生成文件：${item.targetPath.replace(config.projectDir, '')}`);
        }))
        .catch(err => logger.error(err))
        .then(() => logger.complete('创建插件完成'));
}

exports.command = 'plugin <name|path>';

exports.desc = '创建插件';

exports.builder = function builder(yargs) {
    yargs
        .positional('path', {
            desc: '插件名称',
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
    newPlugin({
        path,
        templateSource: ts || _.get(config, 'templates.plugin.source'),
    });
};

exports.newPlugin = newPlugin;
