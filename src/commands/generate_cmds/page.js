const templates = require('@beautywe/framework');
const parsePath = require('../../libs/parse-path');
const config = require('../../libs/config');
const logger = require('../../libs/logger');
const _ = require('lodash');
const fs = require('fs-extra');
const pathTool = require('path');

function newPage({ pagePath, templateSource, subPkg }) {
    let targetDir;
    let pageName;
    let pageRoute;
    let relativeToAppDir;

    return Promise
        .resolve()

        // 解析路径
        .then(() => {
            const pathResult = parsePath({ name: pagePath, subPkg });
            targetDir = pathResult.pathName;
            pageName = pathResult.baseName;
            pageRoute = `${pathResult.route}/index`;
            relativeToAppDir = pathResult.relativeToAppDir;

            logger.start(`创建页面：${pageRoute}`);
        })

        // 渲染生成页面
        .then(() => templates.render({
            type: 'page',
            targetDir,
            params: { name: pageName, route: pageRoute, relativeToAppDir },
            sourceDir: templateSource,
        }))

        // logger
        .then(result => result.forEach(item => logger.success(`生成文件：${item.targetPath.replace(config.projectDir, '')}`)))

        // 写入路由
        .then(() => {
            if (!config.writeRouteAfterCreated) return Promise.resolve();
            const file = pathTool.join(config.appDir, 'app.json');
            return fs.readJSON(file)
                .then((result) => {
                    if (subPkg) {
                        // 写入分包
                        const subPkgPageRoute = pageRoute.replace(new RegExp(`^/${subPkg}/`), '');
                        const defaultSubPkgConfig = { root: subPkg, pages: [subPkgPageRoute] };
                        if (!result.subPackages) result.subPackages = [defaultSubPkgConfig];
                        else if (_.findIndex(result.subPackages, { root: subPkg }) <= -1) result.subPackages.push(defaultSubPkgConfig);
                        else {
                            result.subPackages.forEach((item) => {
                                if (item.root === subPkg) {
                                    if (!item.pages) item.pages = [subPkgPageRoute];
                                    if (_.indexOf(item.pages, subPkgPageRoute) > -1) throw new Error(`${subPkg}|${subPkgPageRoute} 已存在`);
                                    else item.pages.push(subPkgPageRoute);
                                }
                            });
                        }
                    } else {
                        // 写入主包
                        const _pageRoute = pageRoute.replace(/^\//, '');
                        if (!result.pages) result.pages = [_pageRoute];
                        else if (_.indexOf(result.pages, _pageRoute) > -1) throw new Error(`${_pageRoute} 已存在`);
                        else result.pages.push(_pageRoute);
                    }

                    return fs.writeJSON(file, result, { spaces: '\t' });
                })
                .then(() => logger.success(`自动写入路由到：${file.replace(config.appDir, '')}`))
                .catch(error => logger.error('自动写入路由失败: ', error.message));
        })

        // logger
        .then(() => logger.complete('创建页面完成'))
        .catch((err) => {
            logger.error(err);
            logger.error('创建页面失败');
        });
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
        .option('sp', {
            alias: 'subpkg',
            type: 'string',
            desc: '分包名, 指定该参数下，path 不能为绝对路径',
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
    const { path, ts, sp } = argv;
    newPage({
        pagePath: path,
        templateSource: ts || _.get(config, 'templates.page.source'),
        subPkg: sp,
    });
};
