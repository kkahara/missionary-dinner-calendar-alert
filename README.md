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

{"_id":{"$oid":"5c60f6581c9d440000c997d5"},"name":"password","value":"password"}

{"_id":{"$oid":"5c60f68b1c9d440000c997d6"},"name":"accountSID","value":"Twilio accountsid"}

{"_id":{"$oid":"5c60f69e1c9d440000c997d7"},"name":"authToken","value":"Twilio authToken"}

{"_id":{"$oid":"5c60f6fe1c9d440000c997d8"},"name":"testNum","value":"1234567890"}

{"_id":{"$oid":"5c66d86d1c9d4400006e5656"},"name":"execution_hour_24h","value":"21"}

In addition, the two environment configurations need to be created:
heroku config:set app_env=test
heroku config:set MongoDB_Connection_URL=mongodb+srv://username:password@URL
