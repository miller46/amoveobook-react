import {
	GET_HEIGHT_SUCCESS,
	GET_HEIGHT_FAILURE,
	GET_HEIGHT_STARTED
} from '../actions/types';

import {api} from '../config'

export const getHeight = () => {
	return (dispatch, getState) => {
		dispatch(getHeightStarted());

		fetch(api.defaultNodeUrl,
			{
				method: 'POST',
				body: JSON.stringify(["height"])
			}
		)
		.then(function(response) {
			return response.json();
		})
		.then(function(json) {
			dispatch(getHeightSuccess(json[1]));
		})
		.catch(err => {
			dispatch(getHeightFailure(err.message));
		});
	};
};

const getHeightSuccess = (height, lastHeightCheck) => ({
	type: GET_HEIGHT_SUCCESS,
	payload: {
		height,
		lastHeightCheck,
	}
});

const getHeightStarted = () => ({
	type: GET_HEIGHT_STARTED
});

const getHeightFailure = error => ({
	type: GET_HEIGHT_FAILURE,
	payload: {
		error
	}
});
