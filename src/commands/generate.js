exports.command = 'new <type>';
exports.desc = 'Create something';
exports.builder = function builder(yargs) {
    return yargs.commandDir('generate_cmds');
};
