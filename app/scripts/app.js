(function(){
  "use strict";

  //$('#devicestatus').toggleClass('reachable').html('YO');
  start_ping();
})();

function ping_sensor(host) {
  console.log("ping sensor");
  ping = require('ping');
  ping.sys.probe(host, function (status) {
    if (status) {
      $('#devicestatus').addClass('reachable').html('YO');
    } else {
      $('#devicestatus').removeClass('reachable').html('NOO');
    }
    setTimeout(function() { ping_sensor(host); }, 1000);
  });
}

function start_ping() {
  host = 'heise.de';
  ping_sensor(host);
}
