
window.onerror = function(message, url, lineNumber) {
    console.error(message,url,lineNumber);
    return true; // prevents browser error messages
};

(function(){
  "use strict";

  $('#sensor-wlan-ssid').text('sensor');
  $('#sensor-wlan-pwd').text('bla');
  $('#sensor-ip').text('localhost'); //192.168.23.203 178.169.0.1
  $('#sensor-port').text('5001');

    //$('#devicestatus').toggleClass('reachable').html('YO');
    start_ping();

    // debug window
    $('#show-debugbox').on('click', function() {
      require('nw.gui').Window.get().showDevTools();
    });

    workflow_step1();
    workflow_step2();
    workflow_step3();

    init_step1();

})();

was_sensor_detected = false;
function sensor_detected() {
  if (was_sensor_detected) return;
  alertbox('success','Sensor gefunden!');
  var $step1 = $('.row.step1');
  var $step2 = $('.row.step2');
  $step1.fadeOut(function() { $step2.fadeIn('slow', function() { init_step2(); }); });
  was_sensor_detected = true;
}

function ping_sensor(host) {
  //console.log("ping sensor");
  ping = require('ping');
  ping.sys.probe(host, function (status) {
    var $stat = $('#devicestatus');
    $stat.removeClass('alert-success alert-info alert-danger');
    if (status) {
      $('#devicestatus').addClass('alert-success').html('Sensor gefunden!');
      sensor_detected();
    } else {
      $('#devicestatus').addClass('alert-warning').html('Sensor konnte noch nicht erkannt werden.');
    }
    setTimeout(function() { ping_sensor(host); }, 1000);
  });
}

function start_ping() {
  host = $('#sensor-ip').html();
  $('#devicestatus').removeClass('alert-info');
  ping_sensor(host);
}

function alertbox(status, message, fadeout) {
  fadeout = fadeout || true;
  $status = $('#alertbox');
  $status.show().html('<div class="alert alert-' + status + '" role="alert">' + message + '</div>');
  if (fadeout) window.setTimeout(function() {
    $status.fadeOut('slow');
  }, 2000);
}
