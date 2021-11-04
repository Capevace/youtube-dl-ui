const promisify = require('util').promisify;
const youtubedl = require('youtube-dl');
const getInfo = promisify(youtubedl.getInfo);

async function getAllFormats(url) {
	const data = await getInfo(url, [], {});
	console.log(data.formats.map(format => ({
		id: format.format_id,
		ext: format.ext,
		format: format.format,
		audio: format.acodec
	})));
}

getAllFormats('https://www.youtube.com/watch?v=f_6d1CkOgXc');