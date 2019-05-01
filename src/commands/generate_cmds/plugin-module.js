const inquirer = require('inquirer');
const nodePath = require('path');
const templates = require('@beautywe/framework');
const logger = require('../../libs/logger');
const config = require('../../libs/config');

function question() {
    const answers = {};
    return inquirer
        .prompt([{
            type: 'input',
            name: 'pluginName',
            validate(input) {
                return !!input;
            },
        }])
        .then((_answers) => {
            Object.assign(answers, _answers);
            return inquirer.prompt([{
                type: 'input',
                name: 'moduleName',
                default: `beautywe-plugin-${_answers.pluginName}`,
            }, {
                type: 'input',
                name: 'desc',
            }, {
                type: 'input',
                name: 'version',
                default: '0.0.1',
                validate(input) {
                    return /^\d+\.(\d+\.)*\d+$/.test(input);
                },
            }]);
        })
        .then((_answers) => {
            Object.assign(answers, _answers);
            return inquirer.prompt([{
                type: 'confirm',
                name: 'confirm',
                message: `这样可以么: \n${JSON.stringify(answers, null, 4)}\n`,
                default: true,
            }]);
        })
        .then(({ confirm }) => {
            if (confirm) return answers;
            throw new Error('Aborted.');
        });
}

exports.command = 'plugin-module';
exports.desc = '创建插件模块';
exports.handler = function handler() {
    let answers = {};
    let targetDir;
    return Promise
        .resolve()
        .then(() => question())
        .then((_answers) => {
            answers = _answers;
            logger.start(`开始创建插件模块：${answers.moduleName}`);

            targetDir = nodePath.join(process.cwd(), `./${answers.moduleName.replace(/@.*\//, '')}`);

            // 复制应用
            return templates.render({ type: 'plugin-module', targetDir, params: answers });
        })

        // 输出结果
        .then(result => result.forEach((item) => {
            logger.success(`生成文件：${item.targetPath.replace(config.projectDir, '')}`);
        }))

        .then(() => logger.success('插件模块已创建完成'))

        .catch((err) => {
            if (err.message === 'Aborted.') logger.fatal(err.message);
            else logger.error(err);
        });
};
