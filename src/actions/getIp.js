import {
	GET_IP_SUCCESS,
	GET_IP_FAILURE,
	GET_IP_STARTED
} from '../actions/types';

import {api} from "../config"

export const getIp = () => {
	return (dispatch, getState) => {
		dispatch(getIpStarted());

		const ip = localStorage.getItem("ip");
		if (ip) {
			getIpDetails(ip, function(json) {
				dispatch(getIpSuccess(json));
			}, function(err) {
				dispatch(getIpFailure(err.message));
			});
		} else {
			const url = api.getIpUrl;
			fetch(url)
			.then(function (response) {
				return response.json();
			})
			.then(function (json) {
				const ip = json["ip"];
				localStorage.setItem("ip", ip);

				getIpDetails(ip, function (json) {
					dispatch(getIpSuccess(json));
				}, function (err) {
					dispatch(getIpFailure(err.message));
				});
			})
			.catch(err => {
				dispatch(getIpFailure(err.message));
			});
		}
	};
};

function getIpDetails(ip, success, failure) {
	const url = api.getIpDetailsUrl.replace(api.replacementCharacter, ip);
	fetch(url)
	.then(function(response) {
		return response.json();
	})
	.then(function(json) {
		success(json);
	})
	.catch(function(err) {
		failure(err.message);
	});
}

const getIpSuccess = ip => {
	return ({
		type: GET_IP_SUCCESS,
		payload: {
			ip
		}
	});
};

const getIpStarted = () => ({
	type: GET_IP_STARTED
});

const getIpFailure = error => ({
	type: GET_IP_FAILURE,
	payload: {
		error
	}
});
