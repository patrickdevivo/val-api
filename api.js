var express = require('express');
var request = require('request');
var moment = require('moment');
var cheerio = require('cheerio');

var app = express();

app.get('/', function(req, res) {
	res.redirect('/today');
});

app.get('/today', function(req, res) {
	var today = moment().format('YYYY-MM-DD');
	var output = {
		breakfast: '',
		lunch: '',
		dinner: ''
	};
	request.get('https://www.amherst.edu/campuslife/dining/menu', function (error, response, body) {
		if (!error && response.statusCode == 200) {
			var $ = cheerio.load(response.body);

			var breakfast = $('#dining-menu-'+today+'-Breakfast-menu-listing').contents();
			var lunch = $('#dining-menu-'+today+'-Lunch-menu-listing').contents();
			var dinner = $('#dining-menu-'+today+'-Dinner-menu-listing').contents();

			var format = function(meal) {
				return function(i, elem) {
					switch (elem.name) {
						case 'div': output[meal] += $(this).text() + ': '; break;
						case 'p': output[meal] += $(this).text() + '. '; break;
					}
				}
			};

			breakfast.each(format('breakfast'));
			lunch.each(format('lunch'));
			dinner.each(format('dinner'));

			res.json(output)
		}
	})
});

app.listen(8080);