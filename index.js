"use strict";

const request = require("request");
const moment = require("moment");
const async = require("async");
const AsciiTable = require("ascii-table");

function arr_min(input_arr) {
	input_arr = input_arr.sort(function(a, b) {
		return a - b;
	});
	return input_arr[0];
}

function arr_max(input_arr) {
	input_arr = input_arr.sort(function(a, b) {
		return b - a;
	});
	return input_arr[0];
}

function get_hko_temp_data(date_yyyymmdd, callback) {
	var hko_url =
		"http://www.hko.gov.hk/cgi-bin/hko/yes.pl?year=" +
		date_yyyymmdd.substring(0, 4) +
		"&month=" +
		date_yyyymmdd.substring(4, 6) +
		"&day=" +
		date_yyyymmdd.substring(6, 8) +
		"&language=english&B1=Confirm";

	request(hko_url, function(error, response, body) {
		if (error) {
			console.log("error:", error);
		} else {
			var hko_web_lines = body.split("\n");
			var max_temp = [];
			var min_temp = [];

			for (var i = 0; i < hko_web_lines.length; i++) {
				if (hko_web_lines[i].match(/\d+\.\d+\sC\s+\d+\.\d+\sC/g)) {
					min_temp.push(parseFloat(hko_web_lines[i].match(/(?:\d*\.)?\d+/g)[0]));
					max_temp.push(parseFloat(hko_web_lines[i].match(/(?:\d*\.)?\d+/g)[1]));
				}
			}
			min_temp = min_temp.sort(function(a, b) {
				return a - b;
			});
			max_temp = max_temp.sort(function(a, b) {
				return b - a;
			});
			callback(arr_min(min_temp), arr_max(max_temp));
		}
	});
}

function getDates(startDate, stopDate) {
	var dateArray = [];
	var currentDate = moment(startDate);
	var stopDate = moment(stopDate);
	while (currentDate <= stopDate) {
		dateArray.push(moment(currentDate).format("YYYYMMDD"));
		currentDate = moment(currentDate).add(1, "days");
	}
	return dateArray;
}

function monthly_temp_range(date_yyyymm, callback) {
	var start_date = moment(date_yyyymm + "01", "YYYYMMDD").format("YYYY-MM-DD");
	var stop_date = moment(date_yyyymm + "01", "YYYYMMDD").add(1, "months").add(-1, "days").format("YYYY-MM-DD");

	var monthly_min_temp = [];
	var monthly_max_temp = [];

	async.eachOfLimit(
		getDates(start_date, stop_date),
		5,
		function(date_yyyymmdd, key, callback) {
			get_hko_temp_data(date_yyyymmdd, function(min_temp, max_temp) {
				monthly_min_temp.push(min_temp);
				monthly_max_temp.push(max_temp);
				callback(null);
			});
		},
		function(err, res) {
			console.log(date_yyyymm, arr_min(monthly_min_temp), arr_max(monthly_max_temp));
			callback(arr_min(monthly_min_temp), arr_max(monthly_max_temp));
		}
	);
}

function format_output_num(input_num) {
	return parseFloat(Math.round(input_num * 10) / 10).toFixed(1);
}

function gen_ascii_table(input_data) {
	var table = new AsciiTable("HK temperature range");
	table.setHeading("YYYYMM", "Min Temp", "Max Temp");

	input_data.forEach(function(row) {
		table.addRow(row.date, format_output_num(row.monthly_min_temp), format_output_num(row.monthly_max_temp));
	});

	console.log(table.toString());
}

function main_fn() {
	if (process.argv.length < 4) {
		console.log("Please follow this pattern: node index.js start_YYYY end_YYYY month_MM")
		return false;
	} else {
		var start_year = process.argv[2];
		var stop_year = process.argv[3];
		var target_month = process.argv[4];

		var target_yyyymm_arr = [];

		for (var i = 0; i <= parseInt(stop_year) - parseInt(start_year); i++) {
			target_yyyymm_arr.push(String(parseInt(start_year) + i) + target_month);
		}

		var main_data = [];

		async.eachOfSeries(
			target_yyyymm_arr,
			function(date_yyyymm, key, callback) {
				monthly_temp_range(date_yyyymm, function(monthly_min_temp, monthly_max_temp) {
					main_data.push({
						date: date_yyyymm,
						monthly_min_temp: monthly_min_temp,
						monthly_max_temp: monthly_max_temp
					});
					callback(null);
				});
			},
			function(err, res) {
				gen_ascii_table(main_data);
			}
		);
	}
}

main_fn();
