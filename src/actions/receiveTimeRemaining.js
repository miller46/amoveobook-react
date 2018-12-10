const constants = require('../constants')

export function receiveTimeRemaining(error, result) {
	return {
		type: constants.RECEIVE_TIME_REMAINING,
		error,
		result
	}
}
