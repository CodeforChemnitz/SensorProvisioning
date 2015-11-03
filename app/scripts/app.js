(function(){
  "use strict";

  $('#sensor-wlan-ssid').html('sensor');
  $('#sensor-wlan-pwd').html('bla');
  $('#sensor-ip').html('178.169.0.1');


    //$('#devicestatus').toggleClass('reachable').html('YO');
    start_ping();

    // debug window
    require('nw.gui').Window.get().showDevTools();

    workflow_step1();
    workflow_step2();
    workflow_step3();

})();

function workflow_step1() {
  var $step1 = $('.row.step1');
  var $step2 = $('.row.step2');
  $('.step1 .weiter').on('click', function() {
    // TODO muss wieder raus, umschalten automatisch wenn IP erreicht wird (und Sensor antwortet)
    $step1.fadeOut(function() { $step2.fadeIn(); });
  });
}

function workflow_step2() {
  var $step1 = $('.row.step1');
  var $step2 = $('.row.step2');
  var $step3 = $('.row.step3');
  $('.step2 .speichern').on('click', function() {
    // TODO WLAN-SSID+Pwd speichern zum Sensor
    status('info','Übertrage Daten zum Sensor...');
    window.setTimeout(function() {
      status('success','Einstellungen wurden übertragen und gespeichert.', false);
      $step2.fadeOut(function() { $step3.fadeIn(); });
    }, 1000);
  });
  $('.step2 .zurueck').on('click', function() {
    $step2.fadeOut(function() { $step1.fadeIn(); });
  });
}

function workflow_step3() {
  var $step2 = $('.row.step2');
  var $step3 = $('.row.step3');
  $('.step3 .speichern').on('click', function() {
    // TODO Sensoren-Einstellungen speichern
    status('info','Übertrage Daten zum Sensor...');
    window.setTimeout(function() {
      status('success','Einstellungen wurden übertragen und gespeichert.', false);
    }, 1000);
  });
  $('.step3 .zurueck').on('click', function() {
    $step3.fadeOut(function() { $step2.fadeIn(); });
  });
}

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
  host = $('#sensor-ip').html();
  ping_sensor(host);
}

function status(status, message, fadeout) {
  fadeout = fadeout || true;
  $status = $('#alertbox');
  $status.show().html('<div class="alert alert-' + status + '" role="alert">' + message + '</div>');
  if (fadeout) window.setTimeout(function() {
    $status.fadeOut('slow');
  }, 2000);
}
