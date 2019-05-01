const fse = require('fs-extra');
const inquirer = require('inquirer');
const nodePath = require('path');
const templates = require('@beautywe/framework');
const logger = require('../../libs/logger');
const config = require('../../libs/config');

function question() {
    return inquirer
        .prompt([{
            type: 'input',
            name: 'appName',
            default: 'beautywe-app',
        }, {
            type: 'input',
            name: 'version',
            default: '0.0.1',
            validate(input) {
                return /^\d+\.(\d+\.)*\d+$/.test(input);
            },
        }, {
            type: 'input',
            name: 'appid',
        }])
        .then(answers => inquirer.prompt([{
            type: 'confirm',
            name: 'confirm',
            message: `这样可以么: \n${JSON.stringify(answers, null, 4)}\n`,
            default: true,
        }]).then(({ confirm }) => {
            if (confirm) return answers;
            throw new Error('Aborted.');
        }));
}

exports.command = 'app';
exports.desc = '创建应用';
exports.handler = function handler() {
    let answers = {};
    return Promise
        .resolve()
        .then(() => question())
        .then((_answers) => {
            answers = _answers;
            logger.start('开始创建应用');

            const targetDir = nodePath.join(process.cwd(), `/${answers.appName}`);
            return { targetDir };
        })

        // 检查目标目录是否存在
        .then(dirs => new Promise((resolve, reject) => {
            fse
                .access(dirs.targetDir)
                .then(() => reject(new Error(`folder ${answers.appName} already exist`)))
                .catch(() => resolve(dirs));
        }))

        // 复制应用
        .then(({ targetDir }) => templates.render({ type: 'app', targetDir, params: answers }))

        // 输出结果
        .then(result => result.forEach((item) => {
            logger.success(`生成文件：${item.targetPath.replace(config.projectDir, '')}`);
        }))

        // 新建页面
        .then(() => {
            const pageDir = config.templates.page.defaultOutput.replace(config.projectDir, '');
            const targetDir = nodePath.join(process.cwd(), `/${answers.appName}/${pageDir}/home`);
            templates.render({
                type: 'page',
                targetDir,
                params: {
                    name: 'home',
                    route: 'pages/home/index',
                },
            });
        })

        .then(() => logger.success('应用已创建完成'))

        .catch((err) => {
            if (err.message === 'Aborted.') logger.fatal(err.message);
            else logger.error(err);
        });
};
