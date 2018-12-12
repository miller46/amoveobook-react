import {
	SET_LANGUAGE_SUCCESS,
	SET_LANGUAGE_FAILURE,
	SET_LANGUAGE_STARTED
} from '../actions/types';

export const setLanguage = (languageId) => {
	return (dispatch, getState) => {
		dispatch(setLanguageStarted(languageId));

		const localStorage = window.localStorage;
		if (!localStorage) {
			dispatch(setLanguageFailure("LocalStorage not found"));
		} else {
			localStorage.setItem('selectedLanguageId', languageId);
			dispatch(setLanguageSuccess(languageId));
		}
	};
};

const setLanguageSuccess = languageId => ({
	type: SET_LANGUAGE_SUCCESS,
	payload: {
		languageId
	}
});

const setLanguageStarted = (languageId) => ({
	type: SET_LANGUAGE_STARTED,
	payload: {
		languageId
	}
});

const setLanguageFailure = error => ({
	type: SET_LANGUAGE_FAILURE,
	payload: {
		error
	}
});
