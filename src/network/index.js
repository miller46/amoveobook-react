import {api} from '../config'

export function saveEmail(data, callback) {
	post(api.saveEmailUrl, {'content-type': 'application/json'}, data, callback);
}

export function createChannel(data, callback) {
	post(api.openChannelUrl, {}, data, callback);
}

export function get(url, headers, callback) {
	request('get', url, headers, data, callback)
}

export function post(url, headers, data, callback) {
	request('post', url, headers, data, callback)
}

export function put(url, headers, data, callback) {
	request('put', url, headers, data, callback)
}

function request(method, url, headers, data, callback) {
	fetch(url, {
		method: method,
		headers: headers,
		body: JSON.stringify(data)
	}).then(res=>res.json())
	.then(res => {
		callback(undefined, res);
	})
	.catch(error => {
		callback(error, undefined);
	})
}
