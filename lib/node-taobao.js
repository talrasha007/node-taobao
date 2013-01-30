
/*!
 * node-taobao
 * Copyright(c) 2011 e6nian <e6nian@gmail.com>
 * MIT Licensed
 */

var crypto = require('crypto')
    ,request = require('request')
    ,dateFormat = require('dateformat')
    ,url = require('url')
    ;

function createClient(options) {
  return new Client(options);
}

function Client(options){
  this.host        = options.host ||'gw.api.taobao.com';
  this.path        = options.path ||'/router/rest';
  this.appKey      = options.appKey || '';
  this.version     = options.version || '2.0';
  this.sign_method = 'md5';
  this.format      = options.json || 'json';
  this.appSecret   = options.appSecret || '';
  this.timeOut     = options.timeOut || 10000;
}

//api={key:'value'};

Client.prototype.getRequest =  function(params,callback) {
  var self = this;

  params.timestamp     = dateFormat((new Date()),'yyyy-mm-dd HH:mm:ss');
  params.format        = 'json';
  params.sign_method   =  self.sign_method;
  params.app_key       =  self.appKey;
  params.v             =  self.version ;
  params.sign          = self.createSign(params);
  var urlToGet = url.format({ host: self.host ,pathname: self.path ,query:params ,protocol:'http'});
  request.get({url:urlToGet,timeout:self.timeOut}, function (err, res, body) {
    if (err) return callback && callback(new Error(params.method + ': Request error(timeout or network problem).'));
    if (res.statusCode !== 200) return callback && callback(new Error(params.method + ': Request did not return 200.'));

    try { var data = JSON.parse(body); }
    catch (e) { return callback && callback(new Error(params.method + ': Response is not a valid JSON string.')); }

    callback && callback(data.error_response, !data.error_response && data);
  });
}

Client.prototype.createSign = function(args) {
  // sort
  var self = this;
  var names = [];
  for (var arg in args) {
    names.push(arg);
  }
  names = names.sort();
  // concat & wrap with sercetCode
  var ss = [self.appSecret];
  for (var i in names) {
    var n = names[i];
    ss.push(n);
    ss.push(args[n]);
  }
  ss.push(self.appSecret);
  var str = ss.join('');
  // encode by md5
  var md5 = crypto.createHash('md5').update(str, 'utf8').digest('hex');
  // upcase
  return md5.toUpperCase();
};

exports.version = '0.0.2';
exports.createClient = createClient;

