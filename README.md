# Provisioning of Sensors

Provisioning of a sensor node. Mainly to init the Wifi with SSID and password.

*** This is a first prototype using Electron. ***

## Motivation
A dead simple stand-alone application which allows the user to configure their sensors while connection to them via WiFi. Well, because this, there is no internet at this time - so no webapp, dude.

## Target sensor firmware
Phibos implementation of the sensor firmware: https://git.dinotools.org/proof-of-concept/SensorNodeESP8266/
Later the sensor sends data to the Sensor-API: https://github.com/CodeforChemnitz/SensorAPI/blob/master/doc/APIv1.md

## App platform choice

**Electron**
- Homepage: http://electron.atom.io
- Yeoman Generator for it:  https://github.com/sindresorhus/generator-electron

105 MB footprint, phew..

**Alternative: NW.js**
- Homepage http://nwjs.io/
- Docu: https://github.com/nwjs/nw.js
- Yeoman generator: https://github.com/Dica-Developer/generator-node-webkit
- other gen: https://www.npmjs.com/package/generator-nwjs-material
- a little bit out-dated gen.: https://github.com/Anonyfox/node-webkit-hipster-seed

45 MB footprint, a bit better.

## Layout
- Bootstrap 3
- Template: [Bootswatch Lumen](https://bootswatch.com/lumen) (same like Sensorkarte)

## Dev

```
$ npm install
```

Install dependencies.

### Run

```
$ npm start
```

Start the app via `electron` (have a look into `package.json`).

### Build

```
$ npm run build
```

Builds the app for OS X, Linux, and Windows, using [electron-packager](https://github.com/maxogden/electron-packager).


## License

MIT © [Ronny Hartenstein](http://no.homepage.yet)
