var top = require('../lib/node-taobao')
    ,options = {'host':'gw.api.tbsandbox.com','appKey':'test','appSecret':'test'}
    ,params  = {'method':'taobao.user.get','fields':'user_id,uid,sex,location','nick':'sandbox_c_1'}
    ;


var client = top.createClient(options);
var result = client.getRequest(params,function(err,data){
  if(!err){
    console.log(data);
    console.log('getRequest ok');
  }else{
    console.log(err);
    console.log('getRequest err occurs');
  }
});


