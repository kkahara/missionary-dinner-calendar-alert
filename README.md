# missionary-dinner-calendar-alert
send alerts about dinner appointments to missionaries 

This code runs on node.js platform. The app reads dinner appointments from yourward.missionarydinnercalendar.com and send alerts to the  missionaries. It requires a twilio SMS account to send texts. It also requires the Ward mission leader's credential.

Installation:

Download app.js
You must create a mongoDB database connection:

Collection: configurations
Documents:
{"_id":{"$oid":"5c60f6001c9d440000c997d3"},"name":"url","value":"yourward.missionarydinnercalendar.com"}
{"_id":{"$oid":"5c60f63e1c9d440000c997d4"},"name":"username","value":"username"}


Two environment configurations need to be created:
heroku config:set app_env=test
heroku config:set MongoDB_Connection_URL=mongodb+srv://username:password@URL
