var express = require('express');
var webdriver = require('selenium-webdriver'), By = webdriver.By, until = webdriver.until,
  chrome = require('selenium-webdriver/chrome'),
  options = new chrome.Options().addArguments([
		  '--disable-gpu',
	     '--disable-impl-side-painting',
		  '--disable-gpu-sandbox',
		'---disable-background-networking',
		'--disable-accelerated-2d-canvas',
		'--disable-accelerated-jpeg-decoding',
		'--no-sandbox',
		'--test-type=ui',
		]);

var Xray = require('x-ray');
var x = new Xray();
var bodyParser = require('body-parser');
var CronJob = require('cron').CronJob;

var helper = require('sendgrid').mail;
var from_email = new helper.Email('eniodemneri1@gmail.com');
var subject = 'Tickets';
var content = new helper.Content('text/plain', 'Hello');
var emails = ['valentino.isufi1@gmail.com'];
var sg = require('sendgrid')("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");


//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
//sendgrid key

var app = new express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'));

var allData = [];

const driver = new webdriver.Builder().forBrowser('chrome').setChromeOptions(options).build();

var url = ["https://oss.ticketmaster.com/aps/sackings/EN/buy/details/17KFL"];

function teams (count) {

  count++;

  if(count!=url.length){

var arrSection = [];
var arrRow = [];
var arrSeat = [];
var freeSections = [];
allData = [];

x(url[count], "iframe@src")
	(function(err, item) {
		if (err) console.log(err);
		else {

			driver.get(item);
			driver
				.wait(until.elementLocated(By.id('Complete_Section_110')))
				.findElement(By.xpath("parent::*"))
				.getAttribute("innerHTML")
				.then(function(data) {
					var arr = data.split('\"');
					var sections_arr = [];

					for (var i = 0; i < arr.length; i += 1) {
						if (arr[i].split("")[0] === "C") {

							//if(arr[i].split("")[17]!='0'){
								sections_arr.push({value: arr[i]});
							//}
						}
					}

					//sections_arr.reverse();

					function yankees(i) {

						driver
							.wait(until.elementLocated(By.id(sections_arr[i].value)), 1000)
							.then(function() {
								driver
									.executeScript("$('#" + sections_arr[i].value + "').mouseover()")
									.then(function() {
										driver
                      //.sleep(70)
                      .then(function() {
                        driver
                          .findElement(By.className('Section_Price_Rollover_Large_Text'))
                          .then(function() {
        										driver
                            .findElement(By.className('Section_Price_Rollover_Large_Text'))
                            .getAttribute('innerHTML')
                            .then(function(result){
                              if(result != '0' && result != 'N/A'){
                                freeSections.push(sections_arr[i-1].value);
                                console.log(sections_arr[i-1].value);
                                console.log(result);
                              }
                            });
                          },
                          function(err){
                            console.log('error');
                          });

                        });

															});

														if (i < sections_arr.length) {
                              i+=2;
                              if(i >= sections_arr.length){

																function rec(n){
																	driver
																		.wait(until.elementLocated(By.id("Map")),10000)
																		.then(function(){
																			driver
																		.executeScript("$('#" + freeSections[n] + "').click()")
																		.then(function(){
																			driver
																				.wait(until.elementLocated(By.id('seatsBasicMapContainer')))
																				.findElement(By.xpath('div'))
																				.getAttribute('innerHTML')
																				.then(function(data){

																				var arr = data.split('<div class="');
																				arr.shift();
																				arr.unshift('');
																				data = arr.join('!');

																				arr = data.split('" id="');
																				data = arr.join('!');

																				arr = data.split('" style="');
																				data = arr.join('!');
																				arr = data.split('!');

																				var arrId = [];

																				for(var j = 0; j < arr.length; j++){
																					if(j % 3 === 1){
																						if(arr[j] == 'seatUnavailable'){
																							arr[j] = '';
																						}else{
																							arrId.push(arr[j + 1]);

																							driver
																								.executeScript("$('#" + arr[j+1] + "').mouseover()")
																								.then(function(){

																									driver
																										//.sleep(80)
																										.then(function(){

																											driver
																												.findElement(By.className('seat_rollover_holder'))
																												.getAttribute("innerHTML")
																												.then(function(info){

																													var str = info.split("<span>");
																													info = str.join("!");
																													str = info.split("</span>");
																													info = str.join("!");
																													str = info.split("!");
																													var arrData = [];

																													for(var m = 0; m < str.length; m++){

																														if(m == 1 || m == 3 || m == 5 || m == 7){
																															arrData.push(str[m]);
																														}

																													}

																													allData.push(arrData);

																													console.log(arrData);

																												});

																										});

																								});

																									}
																						}
							  													}
																							console.log(arrId);

																							driver
																								.executeScript("$('#Back_Btn').click()")
																								.then(function(){

																															n++;
																															if(n!=freeSections.length){
																																setTimeout(function() {rec(n)}, 4000);
																															}
																															else{

																																//return;
                                                                setTimeout(function() {teams(count)}, 2000);
																															}


																												});
																		});
																		});
																	});
																}
																rec(0);


                              }else{

															setTimeout(function() {yankees(i)}, 180);
                            }

														}
													});

					}

					yankees(0);

				});

	}
});
}
else{

    function sorting (a, b){

      if(a[3] == b[3]){
        return 0;
      }else {
        return (a[3] < b[3]) ? -1 : 1;
      }

    }

    allData.sort(sorting);

  var str = "";
  for(var k = 0; k <  allData.length ; k++){
    str += "<tr><td>" +
    allData[k][0] + "</td><td>" +
    allData[k][1] + "</td><td>" +
    allData[k][2] + "</td><td>" +
    allData[k][3] + "</td></tr>";

  }

  var htmlEmail = `
  <html>
  	<head>
  		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
  		<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>
  	</head>

  	<style>
  		body {
  			padding: 5%;
  		}

  		h1, h3, h4, h5 {
  			font-family: HelveticaNeue-Light;
  		}

  		img {
  			height: 150px;
  			padding: 20px;
  			background-color: #DDD;
  		}

  		th {
  			width: 150px;
  			text-align: center;
  			font-size: 20px;
  		}

  		td{
  			width: 150px;
  			border: 1px solid black;
  			text-align: center;
  			padding-top: 2px;
  			padding-bottom: 2px;
  			font-size: 20px;
  		}

  	</style>

  <body align='middle'>
		<div align="middle">
			<table border="1">
				<thead>
					<tr>
						<th>Section</th>
						<th>Row</th>
						<th>Seat</th>
						<th>Plan Price</th>
					</tr>
				</thead>
			</table> <br>
			<table>
				<tr id='table'>
        ` + str + `
				</tr>
			</table>
		</div>
	</body>
</html>`;

    content = new helper.Content('text/html', htmlEmail);

                              for (var j=0; j<emails.length; j++){
                            	   var to_email = new helper.Email(emails[j]);
                            	   var mail = new helper.Mail(from_email, subject, to_email, content);
                              }

                              var request = sg.emptyRequest({
                                method: 'POST',
                                path: '/v3/mail/send',
                                body: mail.toJSON(),
                              });

                              sg.API(request, function(error, response) {
                                console.log(response.statusCode);
                                console.log(response.body);
                                console.log(response.headers);
                              });

}



}

var job = new CronJob({

  cronTime: "*/30 * * * *",

  onTick: function(){

    teams(-1);

  },

  runOnInit: true,

  start: true

});

job.start();

app.get('/scrap', function(req, res){


      function sorting (a, b){

        if(a[3] == b[3]){
          return 0;
        }else {
          return (a[3] < b[3]) ? -1 : 1;
        }

      }

      allData.sort(sorting);

res.json({a:allData});

});

app.listen(8000);
