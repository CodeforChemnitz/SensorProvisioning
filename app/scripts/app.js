
window.onerror = function(message, url, lineNumber) {
    console.error(message,url,lineNumber);
    return true; // prevents browser error messages
};

(function(){
  "use strict";

  $('#sensor-wlan-ssid').html('sensor');
  $('#sensor-wlan-pwd').html('bla');
  $('#sensor-ip').html('localhost'); //178.169.0.1');
  $('#sensor-port').html('5001');

    //$('#devicestatus').toggleClass('reachable').html('YO');
    start_ping();

    // debug window
    $('#show-debugbox').on('click', function() {
      require('nw.gui').Window.get().showDevTools();
    });

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

was_sensor_detected = false;
function sensor_detected() {
  if (was_sensor_detected) return;
  alertbox('success','Sensor gefunden!');
  var $step1 = $('.row.step1');
  var $step2 = $('.row.step2');
  $step1.fadeOut(function() { $step2.fadeIn(); });
  was_sensor_detected = true;
}

function workflow_step2() {
  var $step1 = $('.row.step1');
  var $step2 = $('.row.step2');
  var $step3 = $('.row.step3');
  $('.step2 .weiter').on('click', function() {

    // 1. validate if all data is filled
    check_step2_filled().then(function() {
      alertbox('info','Übertrage Daten zum Sensor...', false);
      // TODO WLAN-SSID+Pwd speichern zum Sensor
      return send_step2_data();

    }).then(function() {
      alertbox('success','Einstellungen wurden übertragen und gespeichert.');
      $step2.fadeOut(function() { $step3.fadeIn(); });

    }).catch(function(error) {
      alertbox('warning','Fehler: ' + error);
    });
  });
  $('.step2 .zurueck').on('click', function() {
    $step2.fadeOut(function() { $step1.fadeIn(); });
  });
}

function check_step2_filled() {
  // TODO ohne Promise
  return new Promise(function(f, r) {
    if ($('#wifi-pass').val().length == 0) {
      r("Passwort leer");
    }
    if ($('#wifi-pass').val().length < 8) {
      r("Passwort zu kurz (< 8 Zeichen)");
    }
    if ($('#wifi-ssid').val().length == 0) {
      r("SSID leer");
    }
    f(true);
  });
}

function send_step2_data() {
  return Promise.all([
    //api.set_wifi_sta_ssid($('#wifi-ssid').val()),
    api.set_wifi_sta_password($('#wifi-pass').val())
  ]);
}

function workflow_step3() {
  var $step2 = $('.row.step2');
  var $step3 = $('.row.step3');
  $('.step3 .speichern').on('click', function() {
    alertbox('info','Übertrage Daten zum Sensor...', false);
    // TODO Sensoren-Einstellungen speichern
    window.setTimeout(function() {
      alertbox('success','Einstellungen wurden übertragen und gespeichert.');
    }, 1000);
  });
  $('.step3 .zurueck').on('click', function() {
    $step3.fadeOut(function() { $step2.fadeIn(); });
  });
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
