import {
	GET_VEO_PRICE_SUCCESS,
	GET_VEO_PRICE_FAILURE,
	GET_VEO_PRICE_STARTED
} from '../actions/types';

const initialState = {
	loading: true,
	veoPrice: 0,
	error: null
};

export default function getVeoPriceReducer(state = initialState, action) {
	switch (action.type) {
		case GET_VEO_PRICE_STARTED:
			return {
				...state,
				error: null,
				loading: true
			};
		case GET_VEO_PRICE_SUCCESS:
			return {
				...state,
				loading: false,
				error: null,
				veoPrice: action.payload.veoPrice
			};
		case GET_VEO_PRICE_FAILURE:
			return {
				...state,
				loading: false,
				error: action.payload.error
			};
		default:
			return state;
	}
}