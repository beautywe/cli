require('yargs')
    .commandDir('commands')
    .demandCommand()
    .help()
    .argv;
