var UfcAPI = require('./node_modules/ufc-api/dist/v3/api.js');
var express = require('express');
var bodyParser = require('body-parser');
var urlencondedParser = bodyParser.urlencoded({extended: false});
var async = require('async');

var app = express();
app.set('view engine', 'ejs');
app.set('port', (process.env.PORT || 3000));

app.get('/', urlencondedParser, function(req, res){
  res.render('index');
});

app.post('/', urlencondedParser, function(req,res){
  console.log(req.body.Move);
  var allObj = [];
  var count = 0;
  var event_arr = [];
  var sub = req.body.Move;
  UfcAPI.events(function(err, res1) {


    for(var i = 0; i < res1.body.length; i++) {
      event_arr.push(res1.body[i].id);
    }
    for(var j = 0; j < event_arr.length; j++){
      if (j == event_arr.length -1){
        last = true;
      }
      UfcAPI.eventFights(event_arr[j], function(err, res2){
        count+=1;
      if(res2.body.length > 0) {
          for (var k = 0; k < res2.body.length; k++){
            if( "result" in res2.body[k]){
              if(res2.body[k].result.Submission == sub) {
                allObj.push(res2.body[k]);
              }
            }
          }
        }
      if (count == event_arr.length){
        res.render('result', {data: req.body, fightInfo: allObj});
      }
      });
    }
  });
});


app.listen(app.get('port'));
