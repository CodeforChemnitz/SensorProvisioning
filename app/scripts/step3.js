
function workflow_step3() {
  var $step2 = $('.row.step2');
  var $step3 = $('.row.step3');

  $('.step3 .speichern_sensors').on('click', function() {
    alertbox('info','Speichere Sensoren...', false);
    send_step3_data().then(function(data) {
      var messages = _.map(data, function(itm) { return itm.id + ': ' + itm.response; });
      alertbox('success','Einstellungen gespeichert. (' + messages.join(', ') + ')');
    }).catch(function(error) {
      alertbox('warning','Fehler: ' + error);
    });
  });

  $('.step3 .speichern').on('click', function() {
    alertbox('info','Übertrage Daten zum Sensor...', false);
    api.save().then(function(message) {
      alertbox('success','Einstellungen gespeichert. (' + message + ')');
    }).catch(function(error) {
      alertbox('warning','Fehler: ' + error);
    });
  });

  $('.step3 .restart').on('click', function() {
    alertbox('info','Sensor wird neu gestartet...', false);
    api.restart().then(function(message) {
      alertbox('info','Warte bis Sensor wieder antwortet. (' + message + ')');
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

init_step3_done = false
function init_step3() {
  if (init_step3_done) return;

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
    tmpl = _.template('<tr>'
      + '<th scope="active"><input type="checkbox" name="sensor<%- row %>_active" data-row="<%- row %>" value="1"></th>'
      + '<th scope="row"><%- row %></th>'
      + '<td scope="select"></td>'
      + '<td><%- current %></td>'
      + '</tr>'),
    measure = [
      {type: 1, name: 'Temperatur'},
      {type: 2, name: 'Luftdruck'},
      {type: 3, name: 'Luftfeuchtigkeit'}
    ],
    table = $('.sensors.table tbody').empty(),
    p = [];

  for (var id=1; id <= 8; id++) {
    p.push(api.get_sensor(id));
  }
  //console.log("Promise sensors", p);
  Promise.all(p).then(function(datas) {
    _.map(datas, function(data) {
      fillSensorConfigRow(data.id, data.config, tmpl, table, measure);
    });
  })/*.catch(function(error) {
    alertbox('warning','Fehler: ' + error);
  })*/;

  init_step3_done = true;
}

function fillSensorConfigRow(id, config, tmpl, table, measure) {
  row = $(tmpl({row: id, current: "" }));
  table.append(row);
  input = row.find('[scope="active"] input');

  // TODO config.config -> Inputbox

  select = $('<select class="form-control" name="sensor' + id + '_type"></select>');
  select.append($('<option value="0">---</option>'));
  select.append(_.map(measure, function(n) {
    return $('<option value="' + n.type + '">' + n.name + '</option>');
  }));
  row.find('[scope="select"]').append(select);
  if (config.type) {
    setSensorType(config.type)
  } else {
    setSensorType(0);
  }

  //console.log(id, config);
  if (!config.config) {
    disableSensorConfig(input, select);
  } else {
    enableSensorConfig(input, select);
  }
  input.change(inputChanged(input, select));
}

function inputChanged(input, select) {
  return function() {
    if (input.is(':checked')) {
      enableSensorConfig(input, select);
    } else {
      disableSensorConfig(input, select);
    }
  }
}

/**
 * checkbox not checked and selectbox inactive
 */
function disableSensorConfig(input, select) {
  input.removeAttr('checked').prop('checked',false);
  select.attr('disabled','disabled');
}

/**
 * checkbox checked and selectbox active
 */
function enableSensorConfig(input, select) {
  input.attr('checked', 'checked').prop('checked',true);
  select.removeAttr('disabled');
}

function setSensorType(type) {
  select.find('option[value="' + type + '"]')
    .attr('selected','selected')
    .prop('selected','selected');
}


function send_step3_data() {
  var p = [];
  for (var id=1; id <= 8; id++) {
    var active = $('input[name="sensor'+id+'_active"]').is(':checked'),
      type = $('select[name="sensor'+id+'_type"] option:selected').val();
    if (active) {
      p.push(api.set_sensor(id, type, ['1']));
    }
  }
  return Promise.all(p);
}
