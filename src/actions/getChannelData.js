import {
	GET_CHANNEL_DATA_SUCCESS,
	GET_CHANNEL_DATA_FAILURE,
	GET_CHANNEL_DATA_STARTED
} from '../actions/types';

import {api, tokenDecimals} from "../config"
import {requestProof} from "../utility/merkle";
import {sumBets} from "../utility";
import {ssToInternal} from "../utility/format-utility";

export const getChannelData = (network, address, topHeader) => {
	return (dispatch, getState) => {
		dispatch(getChannelDataStarted());

		if (!address) {
			dispatch(getChannelDataFailure("Not logged in"))
		} else {
			fetch(api[network].nodeUrl,
				{
					method: 'POST',
					body: JSON.stringify(["spk", address])
				}
			)
			.then(function (response) {
				return response.json();
			})
			.then(function (json) {
				const channel = json[1];

				const trieKey = channel[1][1][6];
				requestProof(network, topHeader, "channels", trieKey, function(error, result) {
					if (error) {
						console.error(error);
					} else {
						const cd = channel[1];
						const betsMeta = ssToInternal(cd[3])
						const spk = channel[2][1];
						const bets = spk[3];
						bets.shift();

						const id = channel[1][1][6]
						const expires = channel[1][7]
						const amount = spk[7];
						const betAmount = sumBets(bets);
						const myBalance = (result[4] - amount - betAmount) / tokenDecimals;
						const serverBalance = (result[5] + amount) / tokenDecimals;

						let sortedBets = []
						let betsByMarket = {}

						for (let i = 0; i < bets.length; i++) {
							const bet = bets[i];
							const market = bet[3][2];
							const amount = bet[2];
							const price = bet[4][2];
							const side = bet[4][1] === 1 ? "true" : "false";
							const meta = betsMeta[i];
							const cancelable = JSON.stringify(meta.code) === JSON.stringify([0,0,0,0,4])
							sortedBets.push(
								{
									market: market,
									amount: amount,
									price: price,
									side: side,
									cancelable: cancelable,
								}
							)

							const marketBet = {
								amount: amount,
								price: price,
								side: side,
								cancelable: cancelable,
							}

							if (market in betsByMarket) {
								const marketBets = betsByMarket[market];
								marketBets.push(marketBet);
							} else {
								betsByMarket[market] = [marketBet]
							}
						}

						const response = {
							id: id,
							expires: expires,
							myBalance: myBalance,
							serverBalance: serverBalance,
							sortedBets: sortedBets,
							betsByMarket: betsByMarket,
						}

						dispatch(getChannelDataSuccess(response));
					}
				})
			}).catch(err => {
				dispatch(getChannelDataFailure(err.message))
			});
		}
	};
};

const getChannelDataSuccess = channelData => {
	return ({
		type: GET_CHANNEL_DATA_SUCCESS,
		payload: {
			channelData
		}
	});
};

const getChannelDataStarted = () => ({
	type: GET_CHANNEL_DATA_STARTED
});

const getChannelDataFailure = error => ({
	type: GET_CHANNEL_DATA_FAILURE,
	payload: {
		error
	}
});
