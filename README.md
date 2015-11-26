# SensorProvisioning

Provisioning of a sensor node. Mainly to init the Wifi with SSID and password.

## Install Dependencies

Install Node and bower packages.

```
npm install && bower install
cd app && npm install
```

## Build NW.js apps

Build the NW.js app.

```
gulp build
```

You'll find the apps here:

- **Mac:** build/SensorProvisioning/osx64/SensorProvisioning.app
- **Win:** build/SensorProvisioning/win32/SensorProvisioning.exe
- **Linux:** build/SensorProvisioning/linux64/SensorProvisioning

## Debugging

We can use [nw](https://www.npmjs.com/package/nw) to start NW.js directly.

```
cd app
nw
```

Open Debugbox and hit F5 for reload :)



## Workflow
1. connect to sensor
2. enter network connection (list available networks, enter credentials)
3. list available pins - specify sensors that are supported

see https://git.dinotools.org/poc/SensorNodeESP8266/about/

## App platform: NW.js
- Homepage http://nwjs.io/
- Docu: https://github.com/nwjs/nw.js
- Yeoman generator: https://github.com/Dica-Developer/generator-node-webkit
- other gen: https://www.npmjs.com/package/generator-nwjs-material
- a little bit out-dated gen.: https://github.com/Anonyfox/node-webkit-hipster-seed


## Theme

Bootswatch Lumen: http://bootswatch.com/lumen/
