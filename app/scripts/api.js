
/*
http://stackoverflow.com/questions/5643321/how-to-make-remote-rest-call-inside-node-js-any-curl
http://rapiddg.com/blog/calling-rest-api-nodejs-script
*/

var querystring = require('querystring');
var https = require('https');

api = {
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
      performRequest('/action/save', 'POST', {}, f);
    });
  }
}

function performRequest(endpoint, method, data, success) {
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

  var req = https.request(options, function(res) {
    //res.setEncoding('utf-8');

    var responseString = '';

    res.on('data', function(data) {
      responseString += data;
    });

    res.on('end', function() {
      console.log(responseString);
      var responseObject = JSON.parse(responseString);
      success(responseObject);
    });
  });

  if (method == 'POST') {
    req.write(dataString);
  }
  req.end();
};
