<div align="center">
	<!-- <a href="https://mateffy.me/mission-control-project">
		<img src="resources/icon-web.png">
	</a> -->
	<h1>youtube-dl-ui</h1>
	<p>
		Basic web UI for youtube-dl. Download a URL in highest quality, choosing between video or audio-only.
	</p>
</div>

<br>

## Installation
```sh
$ npm install -g youtube-dl-ui
```

## Usage
You can now start the server like you would any binary.
```sh
$ youtube-dl-ui
v1.0.0
```

### Options
```
Usage: youtube-dl-ui [options]

Options:
  -V, --version            output the version number
  -p, --port <port>        the port for the http server
  -v, --video-path <path>  path to directory where videos should be saved
  -a, --audio-path <path>  path to directory where audio should be saved
  -d, --debug              enable debug mode
  -h, --help               display help for command
```

### Config
A config file for youtube-dl-ui will be created at `$HOME_DIR/.youtube-dl-ui/config`. However, options passed as command line arguments override settings in this file.

## Changelog
### Version 1.0.0
- First polished release

## Authors
Lukas Mateffy – [@Capevace](https://twitter.com/capevace) – [mateffy.me](https://mateffy.me)

Distributed under the MIT license. See `LICENSE` for more information.

## Contributing

1. Fork it (<https://github.com/capevace/mission-control/fork>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request
