
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

init_step2_done = false;
function init_step2() {
  if (init_step2_done) return;

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
  init_step2_done = true;
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
