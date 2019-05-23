const path = require('path');
const childProcess = require('child_process');

exports.command = 'run <env>';
exports.desc = 'Lift app';
exports.handler = function handler(argv) {
    const gulpPath = path.join(process.cwd(), './node_modules/.bin/gulp');
    childProcess.spawn(`${gulpPath}`, [argv.env], {
        stdio: [process.stdin, process.stdout, process.stderr],
        env: Object.assign({ RUN_ENV: argv.env }, process.env),
    });
};
