import request from 'request'
import {api} from '../config'


export function getNodeData(data, callback) {
	retry(data, callback, 3);
	// callback(null, 10);
}

function retry(data, callback, attempts) {
	if (attempts === 0) {
		callback(new Error("Server overloaded"), null);
	} else {
		var url = api.defaultNodeUrl;
		post(url, {}, JSON.stringify(data), function (error, result) {
			if (error) {
				callback(error, result);
			} else {
				try {
					var response = JSON.parse(result)[1];
					if (response === "c3RvcCBzcGFtbWluZyB0aGUgc2VydmVy") {
						setTimeout(retry(data, callback, attempts - 1), 500);
					} else {
						callback(error, response);
					}
				} catch (e) {
					console.info(e);
					callback(error, result);
				}
			}
		});
	}
}

function get(url, headers, callback) {
	var options = {
		url: url,
		headers: headers
	};
	request.get(options, function(error, httpResponse, body) {
		if (error) {
			callback(error, undefined);
		} else {
			callback(undefined, body);
		}
	});
}

function post(url, headers, data, callback) {
	var options = {
		url: url,
		headers: headers,
		form: data
	};
	request.post(options, function(error, httpResponse, body) {
		if (error) {
			callback(error, undefined);
		} else {
			callback(undefined, body);
		}
	});
}

function put(url, headers, data, callback) {
	var options = {
		url: url,
		headers: headers,
		form: data
	};
	request.put(options, function(error, httpResponse, body) {
		if (error) {
			callback(error, undefined);
		} else {
			callback(undefined, body);
		}
	});
}
