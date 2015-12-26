
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
