var express = require('express');
var router = express.Router();
var twilio = require('twilio');
var resp = new twilio.TwimlResponse();
var randomNum = new Array();
var twiml = new twilio.TwimlResponse();
var saveNumber = {};
var client = require('twilio')('', '');

/* GET users listing. */
router.post('/', function(req, res, next) 
	{
    if(req.body.Body == "list")
		{
		var high = 1000;
		var low = 0;
    
        var number = Math.floor(Math.random() * (high - low) + low);
		randomNum.push(number);

        saveNumber[number] = new Array(req.body.From);
		
        var twiml = new twilio.TwimlResponse();

        twiml.message('Ask your group to send me '+number+' in message body with in 5mins!');

		setTimeout(function()
            {
                var message = "";
                if(saveNumber[number] != undefined){

                    saveNumber[number].forEach(function(entry) {
                        message += entry + '\n';
                    });
                    
                    saveNumber[number].forEach(function(entry) {
                        client.sendMessage({

                            to:entry, // Any number Twilio can deliver to
                            from: '', // A number you bought from Twilio and can use for outbound communication
                            body: message // body of the SMS message

                        }, function(err, responseData) { //this function is executed when a response is received from Twilio

                            if (!err) { // "err" is an error received during the request, if any

                                // "responseData" is a JavaScript object containing data received from Twilio.
                                // A sample response from sending an SMS message is here (click "JSON" to see how the data appears in JavaScript):
                                // http://www.twilio.com/docs/api/rest/sending-sms#example-1

                                console.log(responseData.from); // outputs "+14506667788"
                                console.log(responseData.body); // outputs "word to your mother."

                            }else{
                                console.log(err);
                            }
                        });
                    });

                    delete(saveNumber[number]);

                }
                console.log(message);
			},300000);
        res.set('Content-Type', 'text/xml');
        res.send(twiml.toString());
		}
    else {
        var found = false;
        randomNum.forEach(function(entry) {
                if(entry == req.body.Body){
                    found = true;
                }
        });
        if(found){
            if(saveNumber[req.body.Body] != undefined){
                saveNumber[req.body.Body].push(req.body.From);
            }else{
                saveNumber[req.body.Body] = new Array(req.body.From);
            }
            console.log(saveNumber);
        }else{
            console.log('No!')
        }
    }
    });

module.exports = router;
