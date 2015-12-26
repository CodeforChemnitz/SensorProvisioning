
/*
http://stackoverflow.com/questions/5643321/how-to-make-remote-rest-call-inside-node-js-any-curl
http://rapiddg.com/blog/calling-rest-api-nodejs-script
*/

var querystring = require('querystring');
var http = require('http');

api = {
  register: function(name, email) {
    return new Promise(function(f, r) {
      performRequest('/register', 'POST', {'name': name, 'email': email}, f);
    });
  },
  set_wifi_sta_ssid: function(ssid) {
    return new Promise(function(f, r) {
      performRequest('/config/wifi/sta/ssid', 'POST', {'ssid': ssid}, f);
    });
  },
  set_wifi_sta_password: function(password) {
    return new Promise(function(f, r) {
      performRequest('/config/wifi/sta/password', 'POST', {'password': password}, f);
    });
  },
  save: function() {
    return new Promise(function(f, r) {
      performRequest('/action/save', 'GET', {}, f);
    });
  },
  restart: function() {
    return new Promise(function(f, r) {
      performRequest('/action/restart', 'GET', {}, f);
    });
  },
  get_wifi_ssids: function() {
    return new Promise(function(f, r) {
      performRequest('/info/wifi/ssids', 'GET', {}, function(response) {
        f($.parseJSON(response));
      });
    });
  },
  get_sensor_api_hostname: function() {
    return new Promise(function(f, r) {
      performRequest('/config/api/hostname', 'GET', {}, f);
    });
  },
  set_sensor_api_hostname: function(hostname) {
    return new Promise(function(f, r) {
      performRequest('/config/api/hostname', 'POST', {'hostname': hostname}, f);
    });
  },
  get_sensor_api_port: function() {
    return new Promise(function(f, r) {
      performRequest('/config/api/port', 'GET', {}, f);
    });
  },
  set_sensor_api_port: function(port) {
    return new Promise(function(f, r) {
      performRequest('/config/api/port', 'POST', {'port': port}, f);
    });
  },
  get_sensor: function(id) {
    return new Promise(function(f, r) {
      performRequest('/config/sensor/' + id, 'GET', {}, f, id);
    });
  },
  set_sensor: function(id, type, values) {
    return new Promise(function(f, r) {
      performRequest('/config/sensor/' + id, 'POST', {'type': type, 'config': values.join(',')}, f, id);
    });
  }
}

function performRequest(endpoint, method, data, success, extra) {
  var dataString = "";
  var headers = {'X-Sensor-Version': '1'};

  if (method == 'GET') {
    endpoint += '?' + querystring.stringify(data);
  } else { // POST
    dataString = querystring.stringify(data);
    headers = {
      //'Content-Type': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': dataString.length
    };
  }
  var options = {
    host: $('#sensor-ip').html(),
    port: $('#sensor-port').html(),
    path: endpoint,
    method: method,
    headers: headers
  };

  var req = http.request(options, function(res) {
    //res.setEncoding('utf-8');

    var responseString = '';

    res.on('data', function(data) {
      responseString += data;
    });

    res.on('end', function() {
      console.log(endpoint, data, " -> ", responseString, extra);
      //var responseObject = JSON.parse(responseString);
      success(responseString, extra);
    });
  });

  if (method == 'POST') {
    req.write(dataString);
  }
  req.end();
};
