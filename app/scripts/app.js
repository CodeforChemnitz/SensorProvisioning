
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

function workflow_step1() {
  var $step1 = $('.row.step1');
  var $step2 = $('.row.step2');
  $('.step1 .weiter').on('click', function() {
    // TODO muss wieder raus, umschalten automatisch wenn IP erreicht wird (und Sensor antwortet)
    $step1.fadeOut(function() { $step2.fadeIn('slow', function() { init_step2(); }); });
  });
}

function init_step1() {

}

was_sensor_detected = false;
function sensor_detected() {
  if (was_sensor_detected) return;
  alertbox('success','Sensor gefunden!');
  var $step1 = $('.row.step1');
  var $step2 = $('.row.step2');
  $step1.fadeOut(function() { $step2.fadeIn('slow', function() { init_step2(); }); });
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

    }).then(function(messages) {
      alertbox('success','Einstellungen wurden übertragen und gespeichert. ('+messages.join(', ')+')');
      $step2.fadeOut(function() { $step3.fadeIn('slow', function() { init_step3(); }); });

    }).catch(function(error) {
      alertbox('warning','Fehler: ' + error);
    });
  });
  $('.step2 .zurueck').on('click', function() {
    $step2.fadeOut(function() { $step1.fadeIn('slow', function() { init_step1(); }); });
  });
}

function init_step2() {
  // test vals on localhost
  if ($('#sensor-ip').text() == 'localhost') {
    $('#wifi-ssid').val('testtest');
    $('#wifi-pass').val('testtest');
  }
  // read visible SSIDs from sensor
  api.get_wifi_ssids().then(function(ssids) {
    var list = $('#wifi-ssid-list');
    _.each(ssids, function(itm) {
      $('<span class="label label-default">' + itm.ssid + ' (' + itm.crypt + ')</span>')
        .css({'margin-right': '10px', cursor: 'pointer'})
        .click(function(){
          $('#wifi-ssid').val(itm.ssid);
          $('#wifi-enc').val(itm.crypt);
        })
        .appendTo(list);
    });
  }).catch(function(error) {
      alertbox('warning','Fehler: ' + error);
  });
}

function check_step2_filled() {
  return new Promise(function(f, r) {
    // register user?
    if ($('#email').val()) {
      if ($('#email').val().length == 0) {
        r("Email leer");
      }
      if (!/@/.test($('#email').var())) {
        r("Email sollte schon ein @ enthalten");
      }
    }
    if ($('#wifi-pass').val() || $('#wifi-ssid').val()) {
      if ($('#wifi-pass').val().length == 0) {
        r("Passwort leer");
      }
      if ($('#wifi-pass').val().length < 8) {
        r("Passwort zu kurz (< 8 Zeichen)");
      }
      if ($('#wifi-ssid').val().length == 0) {
        r("SSID leer");
      }
    }
    f(true);
  });
}

function send_step2_data() {
  var p = [];
  if ($('#email').val()) {
    p.push(api.register($('#name').val(), $('#email').val()));
  }
  if ($('#wifi-pass').val() || $('#wifi-ssid').val()) {
    p.push(api.set_wifi_sta_ssid($('#wifi-ssid').val()));
    p.push(api.set_wifi_sta_password($('#wifi-pass').val()));
  }
  return Promise.all(p);
}

function workflow_step3() {
  var $step2 = $('.row.step2');
  var $step3 = $('.row.step3');

  $('.step3 .speichern_sensors').on('click', function() {
    alertbox('info','Speichere Sensoren...', false);
    send_step3_data().then(function(message) {
      alertbox('success','Einstellungen gespeichert. ('+message+')');
    }).catch(function(error) {
      alertbox('warning','Fehler: ' + error);
    });
  });

  $('.step3 .speichern').on('click', function() {
    alertbox('info','Übertrage Daten zum Sensor...', false);
    api.save().then(function(message) {
      alertbox('success','Einstellungen gespeichert. ('+message+')');
    }).catch(function(error) {
      alertbox('warning','Fehler: ' + error);
    });
  });

  $('.step3 .restart').on('click', function() {
    alertbox('info','Sensor wird neu gestartet...', false);
    api.restart().then(function(message) {
      alertbox('info','Warte bis Sensor wieder antwortet. ('+message+')');
      // TODO ping durchführen bis Sensor wieder da ist, dann Erfolg melden
    }).catch(function(error) {
      alertbox('warning','Fehler: ' + error);
    });
  });
  $('.step3 .zurueck').on('click', function() {
    $step3.fadeOut(function() { $step2.fadeIn('slow', function() { init_step2(); }); });
  });

  $('.step3 .speichern_api').on('click', function() {
    alertbox('info','Aktualisiere Sensor-API Access-Point...', false);
    Promise.all([
      api.set_sensor_api_hostname($('#api-hostname').val()),
      api.set_sensor_api_port($('#api-port').val())
    ]).then(function(messages) {
      alertbox('success','Aktualisierung durchgeführt. (' + messages.join(', ') + ')');
    });
  });
}

function init_step3() {
  api.get_sensor_api_hostname().then(function(hostname) {
    $('#api-hostname').val(hostname);
  }).catch(function(error) {
      alertbox('warning','Fehler: ' + error);
  });

  api.get_sensor_api_port().then(function(port) {
    $('#api-port').val(port);
  }).catch(function(error) {
      alertbox('warning','Fehler: ' + error);
  });

  // init each sensor configs
  var row, select,
    tmpl = _.template('<tr><th scope="active"><input type="checkbox" name="sensor<%- row %>_active" value="1"><th scope="row"><%- row %></th><td scope="select"></td><td><%- current %></td></tr>'),
    measure = [{type: 1, name: 'Temperatur'},{type: 2, name: 'Luftdruck'},{type: 3, name: 'Luftfeuchtigkeit'}],
    table = $('.sensors.table tbody'),
    p = [];
  for (var id=1; id <= 8; id++) {
    p.push(api.get_sensor(id));
  }
  Promise.all(p).then(function(datas) {
    _.map(datas, function(data, id, bla) {
      row = $(tmpl({row: id, current: "10 °C" }));
      if (data != 'Config not found') {
        row.find('[scope="active"] input').attr('checked', 'checked');
      }
      select = $('<select class="form-control" name="sensor' + id + '_type"></select>');
      // TODO data.type? then set selected="selected"
      select.append(_.map(measure, function(n) { return $('<option value="' + n.type + '">' + n.name + '</option>'); }));
      row.find('[scope="select"]').append(select);
      table.append(row);
    });
  })/*.catch(function(error) {
    alertbox('warning','Fehler: ' + error);
  })*/;
}


function send_step3_data() {
  var p = [];
  for (var id=1; id <= 8; id++) {
    var active = $('[name="sensor'+id+'_active"]'),
      type = $('select[name="sensor'+id+'_type"] option:selected').val();
    p.push(api.set_sensor(id, {type: type, values: '1'}));
  }
  return Promise.all(p);
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
