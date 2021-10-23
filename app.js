var https = require("https");
var btoa = require("btoa");
var monthNum = new Array(
  "01",
  "02",
  "03",
  "04",
  "05",
  "06",
  "07",
  "08",
  "09",
  "10",
  "11",
  "12"
);
var web_url = process.env["url"];
var web_username = process.env["web_username"];
var web_password = process.env["web_password"];
var twilio_accountSid = process.env["accountSID"];
var twilio_authToken = process.env["authToken"];
var twilio_testNumber = process.env["testNum"];
var execution_hour_24h = process.env["execution_hour_24h"];
var app_env = process.env["app_env"];
if (app_env != "prod") {
  app_env = "test";
}

var body = "";

//read the source
var schedule = require("node-schedule");
var j = schedule.scheduleJob(
  "* * " + execution_hour_24h + " * * *",
  function () {
    var today = new Date();
    var tomorrow = new Date();
    tomorrow.setDate(today.getDate() + 1);

    var options = {
      host: web_url,
      port: 443,
      path:
        "/edit/?date=" +
        monthNum[tomorrow.getMonth()] +
        "-" +
        tomorrow.getFullYear() +
        "&size=2",
      // authentication headers
      headers: {
        Authorization: "Basic " + btoa(web_username + ":" + web_password),
      },
    };

    var request = https.get(options, function (res) {
      res.on("data", function (data) {
        body += data;
      });
      res.on("end", function () {
        //here we have the full response, html or json object
        //extract appointments from body
        var indexDocStart = body.indexOf('<div class="data-table">', 0);
        var indexDocEnd = body.indexOf("</div>", indexDocStart + 1);
        if (indexDocStart > 0 && indexDocEnd > 0) {
          var divBody = body
            .substr(indexDocStart, indexDocEnd - indexDocStart)
            .replace(/(\r\n|\n|\r|\t)/gm, "");

          indexDocStart = 0;
          indexDocEnd = 0;
          var companionshipInfo1 = "";
          var companionshipInfo2 = "";
          var appointmentInfo1 = new Array();
          var appointmentInfo2 = new Array();
          var indexAppointment = 0;

          //extract elders contact info
          indexDocStart = divBody.indexOf("</th><th>", indexDocStart);
          indexDocEnd = divBody.indexOf(
            divBody.indexOf("</th><th>", indexDocStart + 1) === -1
              ? "</th></tr>"
              : "</th><th>"
          );
          companionshipInfo1 = divBody.substr(
            indexDocStart + 9,
            indexDocEnd - indexDocStart - 9
          );
          indexDocStart = indexDocEnd;
          indexDocEnd = divBody.indexOf("</th>", indexDocStart + 1);
          companionshipInfo2 = divBody.substr(
            indexDocStart + 9,
            indexDocEnd - indexDocStart - 9
          );

          //extract appointments from divbody
          indexDocStart = divBody.indexOf("<tr><td>", indexDocStart);

          while (indexDocStart != -1) {
            indexDocEnd = divBody.indexOf("</td>", indexDocStart);
            indexAppointment = divBody.substr(
              indexDocStart + 8,
              indexDocEnd - indexDocStart - 8
            );
            indexDocStart = divBody.indexOf('value="', indexDocEnd);
            indexDocEnd = divBody.indexOf('" />', indexDocStart);
            appointmentInfo1[indexAppointment] = divBody.substr(
              indexDocStart + 7,
              indexDocEnd - indexDocStart - 7
            );
            indexDocStart = divBody.indexOf('value="', indexDocEnd);
            indexDocEnd = divBody.indexOf('" />', indexDocStart);
            appointmentInfo2[indexAppointment] = divBody.substr(
              indexDocStart + 7,
              indexDocEnd - indexDocStart - 7
            );
            indexDocStart = divBody.indexOf("<tr><td>", indexDocStart);
          }

          const client = require("twilio")(twilio_accountSid, twilio_authToken);
          var phoneNums = "";
          const extractor = require("phone-number-extractor");

          extractor
            .getCandidates(companionshipInfo1 + companionshipInfo2, "US")

            .then(function (res) {
              console.log(res);
              phoneNums = res;
              var txMessage = "";
              //companionship #1
              if (appointmentInfo1[tomorrow.getDate()].trim() == "") {
                txMessage =
                  "Sorry, nobody has signed up for dinner tomorrow :(";
              } else {
                txMessage =
                  "ლ(´ڡ`ლ) Dinner tomorrow will be served at the " +
                  appointmentInfo1[tomorrow.getDate()];
              }
              if (app_env == "test") {
                phoneNums[0] = twilio_testNumber;
              }
              client.messages
                .create({
                  body: txMessage,
                  from: "+17275133043",
                  to: "+1" + phoneNums[0],
                })
                .then((message) => console.log(message.sid))
                .done();
              //companionship #2
              if (companionshipInfo1.trim() != "") {
                if (appointmentInfo2[tomorrow.getDate()].trim() == "") {
                  txMessage =
                    "Sorry, nobody has signed up for dinner tomorrow :(";
                } else {
                  txMessage =
                    "ლ(´ڡ`ლ) Dinner tomorrow will be served at the " +
                    appointmentInfo2[tomorrow.getDate()];
                }
                if (app_env == "test") {
                  phoneNums[1] = twilio_testNumber;
                }
                client.messages
                  .create({
                    body: txMessage,
                    from: "+17275133043",
                    to: "+1" + phoneNums[1],
                  })
                  .then((message) => console.log(message.sid))
                  .done();
              }
              client.messages
                .create({
                  body: "job completed!",
                  from: "+17275133043",
                  to: "+1" + twilio_testNumber,
                })
                .then((message) => console.log(message.sid))
                .done();
            })

            .catch(function (err) {
              console.log(err);
              throw err;
            });
        }
      });
      res.on("error", function (e) {
        console.log("Got error: " + e.message);
      });
    });
  }
);
