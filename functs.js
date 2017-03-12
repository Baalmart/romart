const request = require('request')

//For romalice - testing
const PAGE_ACCESS_TOKEN = "EAAa8XcLagGEBAGNqLpFIJPJ04IZAFIDLDl5GObwIJcOGU0YZAVFOkba1stCDKhbxGJ68LXsFjQx3tUh0F9pBL5amHUz3BnXFeUPHbuZAK9HN086jPZATAvGxRQmAPkxugahHv8KMh5DB3wafUJUPZCeEBzJ5Y8QlRHZAklThG6ZAwZDZD"
//For martin - Live
//const PAGE_ACCESS_TOKEN = "EAAXmVa3kCDoBADwfRVpxEZBRlzR8KAwoYAhrUHFP5ZANIExq80SzVfHbm0VZC2gnPmlHzzCy7ZBrZCJ7MCE9yBa4ZAEIv3CeEcgYFZBXRsFc6ItI1i69umPO2iZCpobTO12CAJfY8hH7VFI10NUNHQMUztxknBATvuczKbGDfoY6NAZDZD"
const context=""

module.exports = {
receivedMessage: function(event)
{
    var fromId = event.sender.id;
    var myId = event.recipient.id;
    var timestamp = event.timestamp;
    var message = event.message;

    //verify context
    if(context=="scores"){
        console.log("Context is .[SCORES]. Value: "+message.text);
    }

    console.log("Page %d received message from user %d." , myId, fromId);
    console.log("    Message: " + JSON.stringify(message));

    this.processMessage(fromId, myId, timestamp, message)
},

processMessage: function(fromId, myId, timestamp, message)
{
    var messageId = message.mid;
    var messageText = message.text;
    var messageAttachments = message.attachments;
    var textResponse;

    if (messageAttachments)
        this.processMessageWithAttachements(fromId, messageText, "Message with attachment received");

    // Add logic here to determine appropriate response. For now, just echo it.

    textResponse = this.getResponse(message);
    if (textResponse == "structured")
        this.sendGenericMessage(fromId)
    else
        this.sendTextMessage(fromId, textResponse)
},

// Based on the incoming message, determine what to send back

getResponse: function(message)
{
    var wlcm = "Hi there, would you like some school information? Give me a keyword (i.e: scores, announcements, events, tuition balance)"
    var bye = "Thank you for checking us out. See you next time."

    var rsp = "What do you mean by \"" + message.text + "\"? Give me a keyword (i.e: scores, announcements, events, tuition balance)";

    if (message.text == "start" || message.text == "hey" ){
        rsp = wlcm
    }
    if (message.text == "thanks" || message.text == "thank you"){
        rsp = bye
    }
    if (message.text == "no" || message.text =="no thanks" || message.text =="no thank you"){
        rsp = bye
    }
    if (message.text == "yes"){
        rsp = "Give me a keyword (i.e: scores, announcements, events, tuition balance)"
    }
    if (message.text == "scores"){
        context = "scores"
        rsp = "What is the student ID?" //TODO
    }
    //student id
     if (message.text == "1234"){
        rsp = "Okay! Here are your scores: Maths = 64, English = 34, Chemistry = 56, French = 70. Would you like anything else?"
    }
    if (message.text == "events"){
        rsp =  "Parents meeting: 12th April 2017, 10:30 am - 1:00 pm. Cultural night: 15th April 2017, 6:30 am - 8:30 pm. Do you need anything else?"
    }
    if (message.text == "announcements"){
        rsp = "Parents meeting: 12th April 2017, 10:30 am - 1:00 pm. Cultural night: 15th April 2017, 6:30 am - 8:30 pm. Do you need anything else?"
    }
    if(message.text=="tuition" || message.text=="balance" || message.text=="tuition balance"){
        rsp = "The tuition fee for this year is RWF 120,000. You have already paid RWF 100,000. Your balance is RWF 20,000 which must be paid by June 30th, 2017. Would you like anything else?"
    }
    return rsp;
},

sendTextMessage: function(toId, messageText)
{
  var messageData = {
    recipient: {
      id: toId
    },
    message: {
      text: messageText
    }
  };

  console.log("Sending text-only message to id: " + toId)
  callSendAPI(messageData);
},

// Stubs
processMessageWithAttachements: function(senderId, messageText, messageAttacments)
{
    console.log("Stub: process the message and attachments and send a response")
},

sendGenericMessage: function(toId)
{
  console.log("Stub: send generic (templated) message");
},

doPostback: function(event)
{
  console.log("Stub: process the postback");
},

};

function callSendAPI(messageData)
{ 
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: messageData

  },function (error, response, body) 
    {
        if (error) 
        {
            console.log('Error sending message: ')
            console.log(response);
            console.log(error);
        }
        else if (response.statusCode != 200)
        {
            console.log('Error sending message, response code not 200: ' + response.statusCode);
        }
        else if (response.body.error) 
        {
            console.log('Error: ', response.body.error)
        }
    });  
}