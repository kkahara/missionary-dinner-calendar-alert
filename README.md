# missionary-dinner-calendar-alert
send alerts about dinner appointments to missionaries 

This code runs on node.js platform. The app reads dinner appointments from [yourward].missionarydinnercalendar.com and send alerts to the  missionaries. It requires a twilio SMS account to send texts. It also requires the Ward mission leader's credential.

Installation:

Download app.js

Create the following environmental variables that you are going to run app.js on:

url    // the url of the calendar. e.g. zion1stward.missionarydinnercalendar.com
web_username  //  the admin user name for the missionary dinner calendar site
web_password   // the admin passsword for the missionary dinner calendar site 
accountSID  // Twilio SID
authToken  // Twilio auth token
testNum  //your phone number when you are testing
execution_hour_24h  //an integer value 21 means the reminder will be sent 9pm every night
app_env  //'prod' or 'test'