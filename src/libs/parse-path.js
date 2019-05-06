const path = require('path');
const config = require('../libs/config');

/**
 * 如果name只提供页面名称（例如name: 'myPage'），则最终生成的目录是 {defaultRoot}/myPage ({project}为app.json所在目录)。
 * 如果name是相对路径（例如name: 'path/myPage'），则最终生成的目录是 {defaultRoot}/path/myPage。
 * 如果name是绝对路径（例如name: '/some/path/myPage'），则最终生成的目录是 {project}/some/path/myPage。
 * 如果name只填写了路径（例如name: '/some/path/'），则当做 '/some/path' 处理。
 *
 * @param {*} params.name 名字或路径
 * @param {*} params.type 创建的类型
 * @param {*} params.subPkg 子包名
 * @returns {string} object.baseName 目录名
 * @returns {string} object.pathName 目录路径
 * @returns {string} object.route 相对 appDir 的相对路径
 * @returns {string} object.relativeToAppDir 相对填充
 */
function parsePath({ name, type = 'page', subPkg }) {
    const { name: baseName, root } = path.parse(name);
    let defaultRoot = config.templates[type.toLowerCase()].defaultOutput;
    if (subPkg) {
        if (path.isAbsolute(name)) throw new Error('--subPkg 下，path 不应该为绝对路径');
        defaultRoot = path.join(config.appDir, subPkg, 'pages');
    }
    let pathName = name;

    if (path.isAbsolute(name)) {
        pathName = name.replace(root, '');
    } else if (type === 'plugin') {
        pathName = defaultRoot;
    } else {
        pathName = path.join(defaultRoot, name);
    }

    return {
        baseName,
        pathName,
        route: pathName.replace(config.appDir, ''),
        relativeToAppDir: path.relative(pathName, config.appDir),
    };
}

module.exports = parsePath;
