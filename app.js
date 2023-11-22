require("dotenv").config();
const bodyParser = require("body-parser");
var express = require("express");
var app = express();
const https = require("https");

const myAPI = process.env.API_KEY;

// console.log(myAPI);
// for server to pull static files like styles.css etc. Enter name of static folder.
// create a public folder and add them there.
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", function (req, res) {
	res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
	const firstName = req.body.fName;

	const lastName = req.body.lName;

	const eMail = req.body.email;

	console.log(firstName, lastName, eMail);

	const data = {
		members: [
			{
				email_address: eMail,
				status: "subscribed",
				merge_fields: {
					FNAME: firstName,
					LNAME: lastName,
				},
			},
		],
	};

	const jsonData = JSON.stringify(data);

	const url = "https://us13.api.mailchimp.com/3.0/lists/6100bcca31";

	const options = {
		method: "POST",
		auth: `sharaf:${myAPI}`,
	};

	const request = https.request(url, options, function (response) {
		if (response.statusCode === 200) {
			res.sendFile(__dirname + "/success.html");
		} else {
			res.sendFile(__dirname + "/faliure.html");
		}
		response.on("data", function (data) {
			console.log(JSON.parse(data));
		});
	});

	request.write(jsonData);
	request.end();
});

app.post("/faliure", function (req, res) {
	res.redirect("/");
});

app.listen(process.env.PORT || 4000, () => {
	console.log("SHARAF SERVER running on port 4000");
});
