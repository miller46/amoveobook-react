import {api} from '../config'

export function saveEmail(email, address, signed, callback) {
	const data = {email: email, address: address, signed: signed};
	post(api.saveEmailUrl, {}, data, callback);
}

export function createChannel(amount, duration, callback) {
	const data = {amount: amount, duration: duration};
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
		callback(undefined, body);
	})
	.catch(error => {
		callback(error, undefined);
	})
}
