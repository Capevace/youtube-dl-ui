const pkg = require('../package.json');
const { program } = require('commander');
program
	.version(pkg.version)
	.option('-p, --port <port>', 'the port for the http server')
	.option('-v, --video-path <path>', 'path to directory where videos should be saved')
	.option('-a, --audio-path <path>', 'path to directory where audio should be saved')
	.option('-d, --debug', 'enable debug mode');

program.parse(process.argv);

module.exports = program;