var ping = require('ping');
var host = 'heise.de';

function ping_sensor() {
  ping.sys.probe(host, function (res) {
        console.log(host, res);
        setTimeout(ping_sensor, 1000);
    });
}

ping_sensor();
