const path = require('path');
const config = require('../libs/config');

/**
 * 如果name只提供页面名称（例如name: 'myPage'），则最终生成的目录是 {defaultRoot}/myPage ({project}为app.json所在目录)。
 * 如果name是相对路径（例如name: 'path/myPage'），则最终生成的目录是 {defaultRoot}/path/myPage。
 * 如果name是绝对路径（例如name: '/some/path/myPage'），则最终生成的目录是 {project}/some/path/myPage。
 * 如果name只填写了路径（例如name: '/some/path/'），则当做 '/some/path' 处理。
 *
 * @param {*} name
 * @param {*} type
 * @returns {string} object.baseName 目录名
 * @returns {string} object.pathName 目录路径
 * @returns {string} object.route 相对 appDir 的相对路径
 */
function parsePath(name, type = 'page') {
    const { name: baseName, root } = path.parse(name);
    const defaultRoot = config.templates[type.toLowerCase()].defaultOutput;
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
